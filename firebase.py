import firebase_admin
from firebase_admin import credentials, firestore, auth
from google.cloud.firestore_v1.base_query import FieldFilter
from datetime import datetime

cred = credentials.Certificate("priv.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# GET USER ID FROM AUTHENTICATION - for now anon
def get_user_id_from_auth(token):
    return "dummy_user_id"
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token['uid']
    except auth.AuthError as e:
        print("Error verifying ID token:", e)
        return None

# ?
def get_all_posts():
    got = db.collection('Posts').stream()
    posts_list = [doc.to_dict() for doc in got]
    print(f"{posts_list}")
    return posts_list
# ✓ 
def get_recent_posts():
    got = db.collection('Posts').order_by("date", direction=firestore.Query.DESCENDING).limit(15).stream()
    posts_list = [doc.to_dict() for doc in got]
    return posts_list
# ✓ 
def get_popular_posts():
    got = db.collection('Posts').order_by("views", direction=firestore.Query.DESCENDING).limit(15).stream()
    posts_list = [doc.to_dict() for doc in got]
    return posts_list
# ?
def get_user_posts(user_id):
    try:
        got =  db.collection('Posts').where(filter=FieldFilter(field_path="userID", op_string="==", value=user_id)).stream()
        posts_list = [doc.to_dict() for doc in got]
        return posts_list
    except Exception as e:
        return f"Error fetching posts for User #{user_id}: {str(e)}", 500

# GET A POST BY ID ✓ (object/document reference id as a saved field value?)
def get_post_by_post_id(post_id):
    try:
        post_ref = db.collection('Posts').document(post_id)
        post_data = post_ref.get().to_dict()
        post_ref.update({'views': post_data['views'] + 1})  # the increment is slow though?
        return post_data
    except Exception as e:
        print(f"Error retrieving post {post_id}: {str(e)}")
        return None

# SEARCH FOR POSTS BY POST/UPLOAD DATE
def search_posts_by_date(year=None, month=None, day=None):
    query = db.collection('Posts')
    if year:
        query = query.where(filter=FieldFilter(field_path="date.year", op_string="==", value=year))
    if month:
        query = query.where(filter=FieldFilter(field_path="date.month", op_string="==", value=month))
    if day:
        query = query.where(filter=FieldFilter(field_path="date.day", op_string="==", value=day))
    return query.stream()

# CREATE A POST ✓ (saves object/doc reference ID as field value 'id')
def create_post(userID, title, content, font='monospace'):
    try:
        if userID and title and content:
            post_data = {
                'userID': str(userID),  # change after implementing authentication!
                'author': 'author',     # replace this with actual author info after authentication!
                'title': str(title),
                'content': str(content),
                'date': datetime.now(),
                'views': 0,               # init views to 0
                'id': ''
            }
            if font:
                post_data['font'] = font
            post_ref = db.collection('Posts').add(post_data)
            post_id = post_ref[1].id        # got the document reference ID  # post_ref.id
            post_ref[1].update({'id': post_id})        # add an 'id' field to the post
            return post_id
        else:
            print ("Please fill in all fields")
            return None
    except Exception as e:
        print("Error creating your post:", e)
        return None

# EDIT A POST ✓ :: might have to modify, or ManagePage should show postID with all posts & options...
def edit_post(post_id, title, content): 
    try: 
        new_data = {
            'title' : title,
            'content' : content
        }
        post_ref = db.collection('Posts').document(post_id).update(new_data)
        print(f"Post {post_id} updated successfully")
        return None
    except Exception as e:
        return f"Error editing post: {str(e)}"

# DELETE A POST ✓
def delete_post(post_id):
    try:
        db.collection('Posts').document(post_id).delete()
        print ("Deleted :( ", post_id, " )")
        return None
    except Exception as e:
        print("Error deleting your post", e)
        return None
