upstream sso.walkerljl.com {
	server 127.0.0.1:8001 weight=10 max_fails=2 fail_timeout=30s;
}

server{
	listen                   80;
    server_name              sso.walkerljl.com;
    access_log               /export/servers/nginx/logs/sso.walkerljl.com/sso.walkerljl.com_access.log main;
    error_log                /export/servers/nginx/logs/sso.walkerljl.com/sso.walkerljl.com_error.log warn;
     

	location / {
		proxy_next_upstream     http_500 http_502 http_503 http_504 error timeout invalid_header;
	    proxy_set_header        Host  $host;
	    proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header        J-Forwarded-For $proxy_add_x_forwarded_for;
	    proxy_pass              http://sso.walkerljl.com;
	    expires                 0;
	}
	
	location /logs/ {
	    autoindex       off;
	    deny all;
	}       
}