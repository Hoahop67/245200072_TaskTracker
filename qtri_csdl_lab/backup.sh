#!/bin/bash
BACKUP_DIR="/home/ubuntu/qtri_csdl_lab/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
docker exec -i mysql_db mysqldump -u root -prootpassword myapp > $BACKUP_DIR/myapp_$DATE.sql
find $BACKUP_DIR -type f -name "*.sql" -mtime +7 -delete

