#!/bin/bash
DIR_TARGET_AVANTI_BOLETO="/cygdrive/c/Skill/Skyline/Remessa/AVANTI/Boletos"
DIR_TARGET_AVANTI_DEBITO="/cygdrive/c/Skill/Skyline/Remessa/AVANTI/Debito"

rsync -chavzP --chmod=ugo=rwX -e 'ssh -p 8257' --stats administrador@157.245.135.147:/home/administrador/outbox/itau_boleto/ $DIR_TARGET_AVANTI_BOLETO
rsync -chavzP --chmod=ugo=rwX -e 'ssh -p 8257' --stats administrador@157.245.135.147:/home/administrador/outbox/itau_debito/ $DIR_TARGET_AVANTI_DEBITO
