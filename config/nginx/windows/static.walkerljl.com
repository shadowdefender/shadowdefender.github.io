server{
	listen                   80;
    server_name              static.walkerljl.com;
    access_log               /export/servers/nginx/logs/static.walkerljl.com/static.walkerljl.com_access.log main;
    error_log                /export/servers/nginx/logs/static.walkerljl.com/static.walkerljl.com_error.log warn;     

	location / {
		root /export/App/static.walkerljl.com/orgwalkerljl-static;
		index index.html index.htm;
	}
	
	location /logs/ {
	    autoindex       off;
	    deny all;
	}       
}