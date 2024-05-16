from flask_cors import CORS
from flask import Flask, jsonify, render_template, request, redirect, url_for
from firebase import ( get_recent_posts, get_popular_posts, get_user_posts, get_all_posts,
                       search_posts_by_date, get_user_id_from_auth, 
                       create_post, edit_post, delete_post, get_post_by_post_id )
from firebase_admin import db

app = Flask(__name__)
cors = CORS(app)

# GET HOME PAGE POSTS
@app.route('/')
def home():
    recent_posts = get_recent_posts()
    popular_posts = get_popular_posts()
    with app.app_context():
        return render_template('home.html', recent_posts=recent_posts, popular_posts=popular_posts)

# GET ALL POSTS ?
@app.route('/all', methods=['GET'])
def api_get_all_posts():
    try:
        all_posts = list(get_all_posts())
        return jsonify(all_posts)
    except Exception as e:
        return jsonify(error=f"Error fetching all posts: {str(e)}"), 500

# GET RECENT POSTS ✓ 
@app.route('/recent', methods=['GET'])
def api_get_recent_posts():
    try: 
        recent_posts = list(get_recent_posts())
        return jsonify(recent_posts)
    except Exception as e:
        return f"Error fetching recent posts: {str(e)}", 500

# GET POPULAR POSTS ✓ 
@app.route('/popular', methods=['GET'])
def api_get_popular_posts():
    try: 
        popular_posts = list(get_popular_posts())
        return jsonify(popular_posts)
    except Exception as e:
        return f"Error fetching popular posts: {str(e)}", 500

# GET A POST BY POST ID ✓ 
@app.route('/id/<string:post_id>', methods=['GET'])
def view_post(post_id):
    try:
        post = get_post_by_post_id(post_id)
        return render_template('post.html', post=post) 
    except Exception as e:
        return f"Error retrieving post: {str(e)}", 500 

# SEARCH FOR POSTS BY POST/UPLOAD DATE
@app.route('/search-date', methods=['GET'])
def api_search_posts_by_date():
    try:
        year = request.args.get('year')
        month = request.args.get('month')
        day = request.args.get('day')
        posts = search_posts_by_date(year, month, day)
        return jsonify(posts)
    except Exception as e:
        return f"Error searching posts: {str(e)}", 500
    
# need more search queries, ie. '/search-author'


# CREATE A POST ✓ (to be updated! with authenticated user!)
@app.route('/create', methods=['GET','POST'])
def api_create_post():
    if request.method == 'POST' :
        try:
            #auth_token = request.headers.get('Authorization')
            #userID = get_user_id_from_auth(auth_token)
            # make sure userID matches, almost like a password or verify?
            userID = request.form.get('userID', '0000') # default userID, replace with auth
            title = request.form.get('title')
            content = request.form.get('content')
            font = request.form.get('font', 'monospace') # default font
            post_id = create_post(userID, title, content, font)
            print(f"Success :) {post_id}")
            return view_post(post_id)
        except Exception as e:
            return jsonify(error=f"Error creating your post: {str(e)}"), 500
    else:
        dummy_post = {'font' : 'monospace'}
        return render_template('create.html', post=dummy_post)

# MANAGE - handle EDIT && DELETE && GET ALL POSTS BY auth [User]
@app.route('/manage', methods=['GET'])
def manage():
    try: 
        #auth_token = request.headers.get('Authorization')
        #user_id = get_user_id_from_auth(auth_token)
        user_id = '0000'   # dummy id -- need to replace; user auth & signed in
        user_posts = get_user_posts(user_id)
        return jsonify(user_posts)
        #return render_template('manage.html', user_posts=user_posts)
    except Exception as e:
        return f"Error fetching posts for User #{user_id}: {str(e)}", 500


# EDIT A POST
@app.route('/edit/<string:post_id>', methods=['PUT'])
def api_edit_post(post_id):
    try:
        edit_post(post_id)
        return f"Post {post_id} updated successfully"
    except Exception as e:
        return f"Error updating post {post_id}: {str(e)}"

# DELETE A POST
@app.route('/delete/<string:post_id>', methods=['DELETE'])
def api_delete_post(post_id):
    try:
        delete_post(post_id)
        return f"Post {post_id} deleted successfully"
    except Exception as e:
        return f"Error deleting post {post_id}: {str(e)}"

## 

if __name__ == '__main__':
    app.run(debug=True)
