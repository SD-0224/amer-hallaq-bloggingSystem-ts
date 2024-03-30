# Extended Bloging System: JWT Authentication
Enhance the blogging system project by implementing JWT (JSON Web Token) authentication to secure sensitive endpoints and protect user data.

## Instructions
follow the following general procedure:
* Install Required Packages
* Generate JWT Secret
* Protect Endpoints with JWT Authentication
* Generate JWTs on User Login/Registration
* Attach JWT to Requests
* Verify JWT on the Server
* Handle Errors
* Endpoints/Records to be Protected
* User Profile Endpoint:Endpoint: /api/users/:userId
* Reason: Protect user profiles to ensure that only authenticated users can access their own profiles.

* Sensitive User Operations:Endpoints: /api/users/:userId (for updating user details, password, etc.)
Reason: Protect sensitive user operations to prevent unauthorized users from modifying another user's information.

* Post and Comment Creation/Modification:Endpoints: /api/posts (especially when associating posts with users), /api/posts/:postId, /api/posts/:postId/comments
Reason: Ensure that only authenticated users can create, update, or delete their own posts and comments.

* Category Modification:Endpoint: /api/posts/:postId/categories
Reason: Protect the creation of categories for a post to ensure that only authorized users can modify post categories.

## Expected Associations for the Schema:
The JWT authentication system does not directly affect the schema associations. It enhances security by ensuring that only authenticated and authorized users can perform certain actions on the schema entities, as described above. The existing associations, such as user-post, post-category, and post-comment relationships, remain in place. The JWT authentication primarily focuses on securing access to these associations.

## JWT Type
You can use whatever JWT type or strategy you are familiar with. For instance, the default type for JWT, which is 'JWT' (as defined in the 'typ' header). This is the most common type and is suitable for most applications.