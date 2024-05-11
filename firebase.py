import firebase_admin
from firebase_admin import credentials, firestore, auth
from google.cloud.firestore_v1.base_query import FieldFilter
from datetime import datetime
import bleach

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

# GET A POST BY ID ✓ (object/document reference id as a saved field value?)
def get_post_by_post_id(post_id):
    try:
        post_ref = db.collection('Posts').document(post_id)
        post_data = post_ref.get().to_dict()
        post_data['content'] = post_data['content'].replace('<br>', '\n')
        post_ref.update({'views': post_data['views'] + 1})  # the increment is slow though?
        return post_data
    except Exception as e:
        print(f"Error retrieving post {post_id}: {str(e)}")
        return None

# ✓ 
def search_posts(author=None, title=None, post_id=None, by_views=False, by_date=False):
    print(f"Searching for author: {author}, title: {title}, id: {post_id}, by views: {by_views}, by date: {by_date}")
    posts_ref = db.collection('Posts')
    query_ref = posts_ref

    if author:
        query_ref = query_ref.where("author", "==", author)
        print(f"{query_ref} -- AUTHOR")
    if title:
        query_ref = query_ref.where("title", "==", title)
        print(f"{query_ref} -- TITLE")
    if post_id:
        query_ref = query_ref.where("id", "==", post_id)
        print(f"{query_ref} -- POST #ID")

    results = []
    try:
        docs = query_ref.get()
        for doc in docs:
            if isinstance(doc, firestore.firestore.DocumentSnapshot):
                results.append(doc.to_dict())
            else:
                print(f"Unexpected document type: {type(doc)}")
    except Exception as e:
        print(f"Error fetching documents: {e}")

    if by_views:
        results.sort(key=lambda x: x['views'], reverse=True)
    if by_date:
        results.sort(key=lambda x: x['date'], reverse=True)

    print(f"Total posts found: {len(results)}")
    return results

# ?
def get_all_posts():
    try:
        got = db.collection('Posts').order_by("date", direction=firestore.Query.ASCENDING).stream() 
        posts_list = [doc.to_dict() for doc in got]
        return posts_list
    except Exception as e:
        return f"Error fetching all posts from database: {str(e)}", 500

# ?
def get_user_posts(user_id):
    try:
        got =  db.collection('Posts').where(filter=FieldFilter(field_path="userID", op_string="==", value=user_id)).stream()
        posts_list = [doc.to_dict() for doc in got]
        return sorted(posts_list, key=lambda x: x['date'], reverse=True)
    except Exception as e:
        return f"Error fetching posts for User #{user_id} from database: {str(e)}", 500


# CREATE A POST ✓ (saves object/doc reference ID as field value 'id')
def create_post(userID, title, content, font='monospace'):
    try:
        if userID and title and content:
            content = content.replace('\n', '<br>') 
            allowed_tags = ['b', 'i', 'u', 'em', 'strong', 'p', 'br']
            sanitized_content = bleach.clean(content, tags=allowed_tags, strip=True)
            sanitized_content = sanitized_content.replace('<br>', '\n')
            post_data = {
                'userID': str(userID),  # change after implementing authentication!
                'author': 'author',     # replace this with actual author info after authentication!
                'title': str(title),
                'content': sanitized_content,
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
def edit_post(post_id, title, content, font): 
    try: 
        content = content.replace('\n', '<br>') 
        allowed_tags = ['b', 'i', 'u', 'em', 'strong', 'p', 'br']
        sanitized_content = bleach.clean(content, tags=allowed_tags, strip=True)
        sanitized_content = sanitized_content.replace('<br>', '\n')
        new_data = {
            'title' : title,
            'content' : sanitized_content,
            'font' : font
        }
        post_ref = db.collection('Posts').document(post_id).update(new_data)
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
