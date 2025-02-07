#!/bin/bash
DIR_SOURCE_AVANTI_BOLETOS="/cygdrive/c/palmeiras/SOCIEDADE ESPORTIVA PALMEIRAS/Clube Social - CNAB Arquivos/AVANTI/Boletos"
DIR_SOURCE_AVANTI_DEBITO="/cygdrive/c/palmeiras/SOCIEDADE ESPORTIVA PALMEIRAS/Clube Social - CNAB Arquivos/AVANTI/Debito"
DIR_SOURCE_MULTICLUBES="/cygdrive/c/palmeiras/SOCIEDADE ESPORTIVA PALMEIRAS/Clube Social - CNAB Arquivos/Muticlubes"
DIR_SOURCE_LICENSE="/cygdrive/c/palmeiras/SOCIEDADE ESPORTIVA PALMEIRAS/Clube Social - CNAB Arquivos/License/Boletos"
DIR_TARGET="/cygdrive/c/incanto/inbox"
DIR_BACKUP="/cygdrive/c/incanto/sent"

cd "$DIR_SOURCE_AVANTI_BOLETOS"
FILES_AVANTI_BOLETOS="$(find . -type f -mtime -1)"
for i in $FILES_AVANTI_BOLETOS; do cp $i $DIR_TARGET/; done

cd "$DIR_SOURCE_AVANTI_DEBITO"
FILES_AVANTI_DEBITO="$(find . -type f -mtime -1)"
for i in $FILES_AVANTI_DEBITO; do cp $i $DIR_TARGET/; done

cd "$DIR_SOURCE_MULTICLUBES"
FILES_MULTICLUBES="$(find ./COB_341*.* -type f -mtime -1)"
for i in $FILES_MULTICLUBES; do cp $i $DIR_TARGET/; done

cd "$DIR_SOURCE_LICENSE"
FILES_LICENSE="$(find . -type f -mtime -1)"
for i in $FILES_LICENSE; do cp $i $DIR_TARGET/; done

rsync -chavzP -e 'ssh -p 8257' --stats $DIR_TARGET/*.* administrador@157.245.135.147:/home/administrador/inbox/
mv $DIR_TARGET/*.* $DIR_BACKUP
