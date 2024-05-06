from flask_cors import CORS
from flask import Flask, jsonify, render_template, request, redirect, url_for, flash
from firebase import ( get_recent_posts, get_popular_posts, get_user_posts, get_all_posts,
                       search_posts, get_user_id_from_auth, 
                       create_post, edit_post, delete_post, get_post_by_post_id )
import os

app = Flask(__name__)
cors = CORS(app)
app.secret_key = os.urandom(24)

# GET HOME PAGE POSTS ✓
@app.route('/')
def home():
    recent_posts = get_recent_posts()
    popular_posts = get_popular_posts()
    with app.app_context():
        return render_template('home.html', recent_posts=recent_posts, popular_posts=popular_posts)

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

# SEARCH BY FILTER ✓
@app.route('/search', methods=['GET'])
def api_search_posts():
    all_posts = None
    try:
        author = request.args.get('author')
        title = request.args.get('title')
        post_id = request.args.get('id')
        by_views = 'by_views' in request.args
        by_date = 'by_date' in request.args
        if author or title or post_id or by_views or by_date:
            try: # get filtered posts
                all_posts = search_posts(author, title, post_id, by_views, by_date)
            except Exception as e:
                return f"Error fetching filtered posts: {str(e)}", 500
        else:
            try: # get all posts
                all_posts = get_all_posts()
            except Exception as e:
                return f"Error fetching all posts: {str(e)}", 500
        if all_posts is not None:
            return render_template('search.html', all_posts=all_posts, total_posts=len(all_posts)), 200
        else:
            return "No posts found", 404
    except Exception as e:
        if all_posts is None:
            return f"Error in search route: {str(e)}", 500
        else:
            return f"Error in search route: {str(e)}, all_posts: {all_posts}", 500

            #if request.headers.get('Content-Type') == 'application/json':
            #    return jsonify({'posts': [post.to_dict() for post in all_posts]}), 200
            #else:
            #return render_template('search.html', posts=all_posts), 200
        #else: # get all posts
            #try:
            #    all_posts = get_all_posts()
                #if request.headers.get('Content-Type') == 'application/json':
                #    return jsonify({'posts': [post.to_dict() for post in all_posts]}), 200



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
        return render_template('manage.html', user_posts=user_posts)
    except Exception as e:
        return jsonify(error=f"Error fetching posts for User #{user_id}: {str(e)}"), 500

## GET POST ID && do function, instead of clicking button as property 

# EDIT A POST ✓
@app.route('/edit/<string:post_id>', methods=['GET', 'POST'])
def api_edit_post(post_id):
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']
        try:
            edit_post(post_id, title, content)
            print (f"Post {post_id} updated successfully")
            return view_post(post_id)
        except Exception as e:
            return jsonify(error=f"Error updating post {post_id}: {str(e)}"), 500
    else: 
        post = get_post_by_post_id(post_id)
        return render_template('edit.html', post=post)

# DELETE A POST ✓
@app.route('/delete/<string:post_id>', methods=['POST'])
def api_delete_post(post_id):
    try:
        delete_post(post_id)
        flash(f'post-{post_id}-deleted')
        return redirect(url_for('manage'))
    except Exception as e:
        return jsonify(error=f"Error deleting post {post_id}: {str(e)}"), 500


if __name__ == '__main__':
    app.run(debug=True)
