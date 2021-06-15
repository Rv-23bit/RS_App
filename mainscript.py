from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
import json
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import difflib


app = Flask(__name__)

df = pd.read_csv("datasets/tmdb.csv")
df.drop("Unnamed: 0",axis=1,inplace=True)
df = df.reset_index()
df_1 = pd.read_csv("datasets/credits_processed.csv")

#Fetching Runtime of every movie as adding a column in df
df['runtime'] = df['runtime'].astype(str)
li = []
for i in df['runtime']:
    x = i.split('.')[0]
    li.append(x)
runtime_copy = pd.Series(li)
df['runtime_copy'] = runtime_copy    

#Fetching Cast-ID,Name
# index_id = list(df['id'])
# df_1 = credit[credit['id'].isin(index_id)]
# df_copy = pd.DataFrame(df['title'])
# df_copy['id'] = df['id']
# df_1 = df_1.sort_values(['id'],ascending = True)
# df_copy = df_copy.sort_values(['id'], ascending = True)
# tp = list(df_1['id'])
# df_copy = df_copy[df_copy['id'].isin(tp)]
# df_1['id'] = df_1['id'].drop_duplicates()
# df_1 = df_1.dropna()
# df_1['id'] = df_1['id'].astype(int)
# df_copy = df_copy.reset_index()
# df_1 = df_1.reset_index()
# df_1 = df_1.join(df_copy['title'])
# df_1.drop('index',axis = 1, inplace=True)
# df_1 = df_1.reset_index()
# list_a = []
# list_b = []
# for i,x in enumerate(df_1['id']):
#     a = (df_1[df_1['id'] == x]['title'][i])
#     list_a.append(a)
#     list_b.append(i)
# list_info = []
for i,x in enumerate(df_1['title']):
    str_info = df_1[df_1['title'] == x]['cast'][i]
    #print(i,x,str_info)
    dict_info = eval(str_info)
    dict_info = list(dict_info)
    #list_info.append(dict_info)
    df_1.at[i,'cast'] = dict_info    





count = CountVectorizer(stop_words='english')
count_matrix = count.fit_transform(df['soup'])

# cosine_sim2 = cosine_similarity(count_matrix, count_matrix)


indices = pd.Series(df.index, index=df['title'])
all_titles = [df['title'][i] for i in range(len(df['title']))]

def get_recommendations(title):
    cosine_sim = cosine_similarity(count_matrix, count_matrix)
    idx = indices[title]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:11]
    movie_indices = [i[0] for i in sim_scores]
    tit = df['title'].iloc[movie_indices]
    dat = df['release_date'].iloc[movie_indices]
    return_df = pd.DataFrame(columns=['Title','Year','Similarity Score'])
    return_df['Title'] = tit
    return_df['Year'] = dat
    return_df['Similarity Score'] = sim_scores 
    return return_df

@app.route('/')

def getMovieList():
    movie_list=list(df['title'])
    return render_template('home.html', movie_list=movie_list)

@app.route('/result', methods = ['GET','POST'])    
# def my_function():
#     if request.method == "POST":
#         data = {}    # empty dict to store data
#         data['author'] = request.json['author']
#         data['release_date'] = request.json['movie_release_date']
#         print(data)
#         return render_template('result.html', r_dict = jsonify(data))   
#     else:
#         return "<h2>oops</h2>"     

def getMovieID():

    if request.method == 'POST': 
        usr_input = request.form['Name']

        try:
            movie_id = df[df['title'] == usr_input]['id']
            movie_id = movie_id[movie_id.index[0]]
            runtime = df[df['title'] == usr_input]['runtime_copy']
            runtime = runtime[runtime.index[0]]
            result_df = get_recommendations(usr_input)
            names = []
            dates = []
            sim_score_list = []
            for i in range(len(result_df)):                  
                names.append(result_df.iloc[i][0])
                dates.append(result_df.iloc[i][1])
                sim_score_list.append(result_df.iloc[i][2])

            # Fetching Genre
            genre_df = df[df['title'] == usr_input]['genres'] 
            x = []
            for i in genre_df:
                    x.append(i)                      
            g_final = []
            g1 = x[0].strip('[]').split(',')[0].strip(" '")
            g2 = x[0].strip('[]').split(',')[1].strip(" '")
            g_final.append(g1);g_final.append(g2)
            string_x = ''
            string_y = ''
            for i,x in enumerate(g_final):
                if i == 0:
                    string_x = x
                if i == 1:
                    string_y = x 


            # Usr-input Cast-Name ID
            irm_cast_id =[]
            irm_cast_name = []
            character_list = []
            index = df_1[df_1['title'] == usr_input]['cast'].index[0]
            irm = df_1[df_1['title'] == usr_input]['cast'][index]
            for i in range(len(irm)):
                for j,k in irm[i].items():
                    if j == 'id':
                        irm_cast_id.append(str(k))
                    elif j =='name':
                        irm_cast_name.append(k)
                    elif j == 'character':
                        character_list.append(k)
                    else:
                        pass 
            irm_cast_name = irm_cast_name[:10]     
            irm_cast_id = irm_cast_id[:10]
            character_list = character_list[:10]
            search_cast_el = [i + j for i, j in zip(irm_cast_id, irm_cast_name)]                 

        except:
            return render_template('no_result.html')
        # data = {}    #empty dict to store data
        # data['author'] = request.json['author']
        # data['content'] = request.json['content']
        
        return render_template('result.html', usr_input=usr_input , movie_id=movie_id, runtime = runtime, movie_names = names, movie_date = dates, g1 = string_x.title(), g2 = string_y.title() , sim_score = sim_score_list, character_list = character_list ,cast_info = search_cast_el)    
 
   

@app.route('/team')
def team_template():
    return render_template('team.html')

app.run(
    host="127.0.0.1",
    port=5000
)

app.run(debug=True)
