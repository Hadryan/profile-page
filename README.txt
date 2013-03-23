
Instructions :

1. Create table contests, contestmeta, contestants :
  - sqldump : data/contest.sql
  
2. Define DB CONFIG and UPLOAD Directory & URL
  - file: api/Config.php
  
3. Define base url on local
  - contest\backbone\app\config.js
  - line 122 :
  window.baseUrl = "{YOUR LOCAL BASE URL}"; //  example : http://localhost/backbone