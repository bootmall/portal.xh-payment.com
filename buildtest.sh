#!/bin/bash
#npm run build:test
#&& echo 'git pushlist' && cd ../test-static.portal.payment.com/ && git add . && git commit -m 'publish' && git push -u origin master
folder="../test-stattic.portal.payment.com"
mkdir ../test-stattic.portal.payment.com
if [ ! -d "$folder" ]; then
  mkdir "$folder"
fi

cd "$folder"
git add "$folder/"
git commit "$folder/" -m 'publish'
git push -u origin master