# Incanto

## Dados de Acesso ao Servidor e Deploy

```
ssh -t administrador@157.245.135.147 -p 8257
sudo su
/opt/deploy.sh
```

## Gerar Nova Versão

- Garantir que a cópia de trabalho do seu branch atual esteja atualizada com a remota e que esteja no branch develop

```
git checkout master
git pull origin master

git checkout develop
git pull origin develop
```

- Editar Changelog criando uma nova sessão com as alterações da nova versão, e fazer commit em develop.

```
git commit -m '[MOD]: Changelog' -a
```

- Gerar release com o GitFlow
  - Recomendação para NOME_DO_RELEASE = [vx.y.z]
  - Exemplo de versão de release = v1.0.0

```
export VERSAO=vx.y.z

git flow release start $VERSAO
export GIT_MERGE_AUTOEDIT=no
git flow release finish -m "$VERSAO" $VERSAO
unset GIT_MERGE_AUTOEDIT
git checkout master ; git pull origin master ; git push origin master
git push --tags
git checkout develop ; git pull origin develop ; git push origin develop
git tag -d $VERSAO
```

- Incrementar número de versão nos arquivos e fazer commit e push das alterações referentes ao número de versão

```
Composição do número de versão: major.minor.patch

Comandos a serem usados
yarn version --major
yarn version --minor
yarn version --patch
```

```
cd web/
yarn version --no-git-tag-version --patch
cd ../server
yarn version --no-git-tag-version --patch
cd ../jobs
yarn version --no-git-tag-version --patch
cd ../etl
yarn version --no-git-tag-version --patch

git commit -m '[MOD]: Incanto versão incrementada' -a
git push origin develop
```
