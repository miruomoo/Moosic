Full-Stack Music Web Application

Back-end: Node.js with Key-File-Storage database and Passport.js authentication

Front-end: HTML/CSS/JavaScript

FEATURES

Music: (Database From: https://arxiv.org/abs/1612.01840)

- Guest users can search music database and view public playlists.
- Registered users can create playlists and view playlist info (Songs, Albums, etc..).
- Registered users can leave reviews on public playlists.

Account Management:
- Users can create a new account with email, password, and name.
- Users can change password.
- One account is designated as admin.

Admin:
- Admin can deactive accounts and reviews, or grant other accounts admin status.
- Admin can update Privacy Policy, AUP, and DMCA files.
- Admin can block viewing of contested reviews.


Created in collaboration with George Toufenkijian (https://github.com/GeorgeT-T)

To Run:

<mark> 1. Download CSVs from https://arxiv.org/abs/1612.01840 </mark>

2. $ npm i

3. $ node index.js

4. Site available on http://localhost:3000/
