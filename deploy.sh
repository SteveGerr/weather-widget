# сборка
npm run build

cd dist


git init
git add -A
git commit -m 'deploy project'

git push -f git@github.com:SteveGerr/weather-widget.git master:gh-pages

cd -