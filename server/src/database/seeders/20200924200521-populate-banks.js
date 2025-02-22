'use strict';

const tableName = 'banks'
const content = [
  { id: '001', name: 'BCO DO BRASIL S.A.', nick: 'B.BRASIL', ispb: '00000000', createdAt: new Date(), updatedAt: new Date() },
  { id: '003', name: 'BCO DA AMAZONIA S.A.', nick: 'B.AMAZONIA', ispb: '04902979', createdAt: new Date(), updatedAt: new Date() },
  { id: '004', name: 'BCO DO NORDESTE DO BRASIL S.A.', nick: 'B.NORDESTE', ispb: '07237373', createdAt: new Date(), updatedAt: new Date() },
  { id: '007', name: 'BNDES', nick: 'BNDES', ispb: '33657248', createdAt: new Date(), updatedAt: new Date() },
  { id: '010', name: 'CREDICOAMO', nick: 'CREDICOAMO', ispb: '81723108', createdAt: new Date(), updatedAt: new Date() },
  { id: '011', name: 'C.SUISSE HEDGING-GRIFFO CV S/A', nick: 'C.SUISSE', ispb: '61809182', createdAt: new Date(), updatedAt: new Date() },
  { id: '012', name: 'BANCO INBURSA', nick: 'INBURSA', ispb: '04866275', createdAt: new Date(), updatedAt: new Date() },
  { id: '014', name: 'STATE STREET BR S.A. BCO COMERCIAL', nick: 'STATE STREET', ispb: '09274232', createdAt: new Date(), updatedAt: new Date() },
  { id: '015', name: 'UBS BRASIL CCTVM S.A.', nick: 'UBS BRASIL', ispb: '02819125', createdAt: new Date(), updatedAt: new Date() },
  { id: '016', name: 'SICOOB CREDITRAN', nick: 'SICOOB CREDITRAN', ispb: '04715685', createdAt: new Date(), updatedAt: new Date() },
  { id: '017', name: 'BNY MELLON BCO S.A.', nick: 'BNY MELLON', ispb: '42272526', createdAt: new Date(), updatedAt: new Date() },
  { id: '018', name: 'BCO TRICURY S.A.', nick: 'TRICURY', ispb: '57839805', createdAt: new Date(), updatedAt: new Date() },
  { id: '021', name: 'BCO BANESTES S.A.', nick: 'BANESTES', ispb: '28127603', createdAt: new Date(), updatedAt: new Date() },
  { id: '024', name: 'BCO BANDEPE S.A.', nick: 'BANDEPE', ispb: '10866788', createdAt: new Date(), updatedAt: new Date() },
  { id: '025', name: 'BCO ALFA S.A.', nick: 'B.ALFA', ispb: '03323840', createdAt: new Date(), updatedAt: new Date() },
  { id: '029', name: 'BANCO ITAÚ CONSIGNADO S.A.', nick: 'ITAÚ CONSIGNADO', ispb: '33885724', createdAt: new Date(), updatedAt: new Date() },
  { id: '033', name: 'BCO SANTANDER (BRASIL) S.A.', nick: 'SANTANDER', ispb: '90400888', createdAt: new Date(), updatedAt: new Date() },
  { id: '036', name: 'BCO BBI S.A.', nick: 'BBI', ispb: '06271464', createdAt: new Date(), updatedAt: new Date() },
  { id: '037', name: 'BCO DO EST. DO PA S.A.', nick: 'B.PA', ispb: '04913711', createdAt: new Date(), updatedAt: new Date() },
  { id: '040', name: 'BCO CARGILL S.A.', nick: 'B.CARGILL', ispb: '03609817', createdAt: new Date(), updatedAt: new Date() },
  { id: '041', name: 'BCO DO ESTADO DO RS S.A.', nick: 'B.RS', ispb: '92702067', createdAt: new Date(), updatedAt: new Date() },
  { id: '047', name: 'BCO DO EST. DE SE S.A.', nick: 'B.SE', ispb: '13009717', createdAt: new Date(), updatedAt: new Date() },
  { id: '060', name: 'CONFIDENCE CC S.A.', nick: 'CONFIDENCE', ispb: '04913129', createdAt: new Date(), updatedAt: new Date() },
  { id: '062', name: 'HIPERCARD BM S.A.', nick: 'HIPERCARD', ispb: '03012230', createdAt: new Date(), updatedAt: new Date() },
  { id: '063', name: 'BANCO BRADESCARD', nick: 'BRADESCARD', ispb: '04184779', createdAt: new Date(), updatedAt: new Date() },
  { id: '064', name: 'GOLDMAN SACHS DO BRASIL BM S.A', nick: 'GOLDMAN SACHS', ispb: '04332281', createdAt: new Date(), updatedAt: new Date() },
  { id: '065', name: 'BCO ANDBANK S.A.', nick: 'ANDBANK', ispb: '48795256', createdAt: new Date(), updatedAt: new Date() },
  { id: '066', name: 'BCO MORGAN STANLEY S.A.', nick: 'MORGAN STANLEY', ispb: '02801938', createdAt: new Date(), updatedAt: new Date() },
  { id: '069', name: 'BCO CREFISA S.A.', nick: 'CREFISA', ispb: '61033106', createdAt: new Date(), updatedAt: new Date() },
  { id: '070', name: 'BRB - BCO DE BRASILIA S.A.', nick: 'BRB', ispb: '00000208', createdAt: new Date(), updatedAt: new Date() },
  { id: '074', name: 'BCO. J.SAFRA S.A.', nick: 'J.SAFRA', ispb: '03017677', createdAt: new Date(), updatedAt: new Date() },
  { id: '075', name: 'BCO ABN AMRO S.A.', nick: 'ABN AMRO', ispb: '03532415', createdAt: new Date(), updatedAt: new Date() },
  { id: '076', name: 'BCO KDB BRASIL S.A.', nick: 'KDB BRASIL', ispb: '07656500', createdAt: new Date(), updatedAt: new Date() },
  { id: '077', name: 'BANCO INTER', nick: 'B.INTER', ispb: '00416968', createdAt: new Date(), updatedAt: new Date() },
  { id: '078', name: 'HAITONG BI DO BRASIL S.A.', nick: 'HAITONG BI', ispb: '34111187', createdAt: new Date(), updatedAt: new Date() },
  { id: '079', name: 'BCO ORIGINAL DO AGRO S/A', nick: 'BCO ORIGINAL', ispb: '09516419', createdAt: new Date(), updatedAt: new Date() },
  { id: '080', name: 'B&T CC LTDA.', nick: 'B&T CC', ispb: '73622748', createdAt: new Date(), updatedAt: new Date() },
  { id: '081', name: 'BANCOSEGURO S.A.', nick: 'BANCOSEGURO', ispb: '10264663', createdAt: new Date(), updatedAt: new Date() },
  { id: '082', name: 'BANCO TOPÁZIO S.A.', nick: 'TOPÁZIO', ispb: '07679404', createdAt: new Date(), updatedAt: new Date() },
  { id: '083', name: 'BCO DA CHINA BRASIL S.A.', nick: 'B.CHINA', ispb: '10690848', createdAt: new Date(), updatedAt: new Date() },
  { id: '084', name: 'UNIPRIME NORTE DO PARANÁ - CC', nick: 'UNIPRIME NORTE', ispb: '02398976', createdAt: new Date(), updatedAt: new Date() },
  { id: '085', name: 'COOP CENTRAL AILOS', nick: 'COOP CENTRAL', ispb: '05463212', createdAt: new Date(), updatedAt: new Date() },
  { id: '088', name: 'BANCO RANDON S.A.', nick: 'RANDON', ispb: '11476673', createdAt: new Date(), updatedAt: new Date() },
  { id: '089', name: 'CREDISAN CC', nick: 'CREDISAN', ispb: '62109566', createdAt: new Date(), updatedAt: new Date() },
  { id: '091', name: 'CCCM UNICRED CENTRAL RS', nick: 'CCCM UNICRED', ispb: '01634601', createdAt: new Date(), updatedAt: new Date() },
  { id: '092', name: 'BRK S.A. CFI', nick: 'BRK S.A.', ispb: '12865507', createdAt: new Date(), updatedAt: new Date() },
  { id: '093', name: 'POLOCRED SCMEPP LTDA.', nick: 'POLOCRED', ispb: '07945233', createdAt: new Date(), updatedAt: new Date() },
  { id: '094', name: 'BANCO FINAXIS', nick: 'FINAXIS', ispb: '11758741', createdAt: new Date(), updatedAt: new Date() },
  { id: '095', name: 'TRAVELEX BANCO DE CÂMBIO S.A.', nick: 'TRAVELEX', ispb: '11703662', createdAt: new Date(), updatedAt: new Date() },
  { id: '096', name: 'BCO B3 S.A.', nick: 'B.B3', ispb: '00997185', createdAt: new Date(), updatedAt: new Date() },
  { id: '097', name: 'CREDISIS CENTRAL DE COOPERATIVAS DE CRÉDITO LTDA.', nick: 'CREDISIS', ispb: '04632856', createdAt: new Date(), updatedAt: new Date() },
  { id: '098', name: 'CREDIALIANÇA CCR', nick: 'CREDIALIANÇA', ispb: '78157146', createdAt: new Date(), updatedAt: new Date() },
  { id: '099', name: 'UNIPRIME CENTRAL CCC LTDA.', nick: 'UNIPRIME', ispb: '03046391', createdAt: new Date(), updatedAt: new Date() },
  { id: '100', name: 'PLANNER CV S.A.', nick: 'PLANNER CV', ispb: '00806535', createdAt: new Date(), updatedAt: new Date() },
  { id: '101', name: 'RENASCENCA DTVM LTDA', nick: 'RENASCENCA', ispb: '62287735', createdAt: new Date(), updatedAt: new Date() },
  { id: '102', name: 'XP INVESTIMENTOS CCTVM S/A', nick: 'XP INVESTIMENTOS', ispb: '02332886', createdAt: new Date(), updatedAt: new Date() },
  { id: '104', name: 'CAIXA ECONOMICA FEDERAL', nick: 'CEF', ispb: '00360305', createdAt: new Date(), updatedAt: new Date() },
  { id: '105', name: 'LECCA CFI S.A.', nick: 'LECCA', ispb: '07652226', createdAt: new Date(), updatedAt: new Date() },
  { id: '107', name: 'BCO BOCOM BBM S.A.', nick: 'BOCOM', ispb: '15114366', createdAt: new Date(), updatedAt: new Date() },
  { id: '108', name: 'PORTOCRED S.A. - CFI', nick: 'PORTOCRED', ispb: '01800019', createdAt: new Date(), updatedAt: new Date() },
  { id: '111', name: 'OLIVEIRA TRUST DTVM S.A.', nick: 'OLIVEIRA TRUST', ispb: '36113876', createdAt: new Date(), updatedAt: new Date() },
  { id: '113', name: 'MAGLIANO S.A. CCVM', nick: 'MAGLIANO', ispb: '61723847', createdAt: new Date(), updatedAt: new Date() },
  { id: '114', name: 'CENTRAL COOPERATIVA DE CRÉDITO NO ESTADO DO ESPÍRITO SANTO', nick: 'COPP ES', ispb: '05790149', createdAt: new Date(), updatedAt: new Date() },
  { id: '117', name: 'ADVANCED CC LTDA', nick: 'ADVANCED', ispb: '92856905', createdAt: new Date(), updatedAt: new Date() },
  { id: '119', name: 'BCO WESTERN UNION', nick: 'WESTERN UNION', ispb: '13720915', createdAt: new Date(), updatedAt: new Date() },
  { id: '120', name: 'BCO RODOBENS S.A.', nick: 'RODOBENS', ispb: '33603457', createdAt: new Date(), updatedAt: new Date() },
  { id: '121', name: 'BCO AGIBANK S.A.', nick: 'AGIBANK', ispb: '10664513', createdAt: new Date(), updatedAt: new Date() },
  { id: '122', name: 'BCO BRADESCO BERJ S.A.', nick: 'BRADESCO BERJ', ispb: '33147315', createdAt: new Date(), updatedAt: new Date() },
  { id: '124', name: 'BCO WOORI BANK DO BRASIL S.A.', nick: 'WOORI BANK', ispb: '15357060', createdAt: new Date(), updatedAt: new Date() },
  { id: '125', name: 'PLURAL BCO BM', nick: 'PLURAL', ispb: '45246410', createdAt: new Date(), updatedAt: new Date() },
  { id: '126', name: 'BR PARTNERS BI', nick: 'BR PARTNERS', ispb: '13220493', createdAt: new Date(), updatedAt: new Date() },
  { id: '127', name: 'CODEPE CVC S.A.', nick: 'CODEPE', ispb: '09512542', createdAt: new Date(), updatedAt: new Date() },
  { id: '128', name: 'MS BANK S.A. BCO DE CÂMBIO', nick: 'MS BANK', ispb: '19307785', createdAt: new Date(), updatedAt: new Date() },
  { id: '129', name: 'UBS BRASIL BI S.A.', nick: 'UBS BRASIL', ispb: '18520834', createdAt: new Date(), updatedAt: new Date() },
  { id: '130', name: 'CARUANA SCFI', nick: 'CARUANA', ispb: '09313766', createdAt: new Date(), updatedAt: new Date() },
  { id: '131', name: 'TULLETT PREBON BRASIL CVC LTDA', nick: 'TULLETT PREBON', ispb: '61747085', createdAt: new Date(), updatedAt: new Date() },
  { id: '132', name: 'ICBC DO BRASIL BM S.A.', nick: 'ICBC DO BRASIL', ispb: '17453575', createdAt: new Date(), updatedAt: new Date() },
  { id: '133', name: 'CRESOL CONFEDERAÇÃO', nick: 'CRESOL', ispb: '10398952', createdAt: new Date(), updatedAt: new Date() },
  { id: '134', name: 'BGC LIQUIDEZ DTVM LTDA', nick: 'BGC LIQUIDEZ', ispb: '33862244', createdAt: new Date(), updatedAt: new Date() },
  { id: '136', name: 'UNICRED', nick: 'UNICRED', ispb: '00315557', createdAt: new Date(), updatedAt: new Date() },
  { id: '138', name: 'GET MONEY CC LTDA', nick: 'GET MONEY', ispb: '10853017', createdAt: new Date(), updatedAt: new Date() },
  { id: '139', name: 'INTESA SANPAOLO BRASIL S.A. BM', nick: 'INTESA SANPAOLO', ispb: '55230916', createdAt: new Date(), updatedAt: new Date() },
  { id: '140', name: 'EASYNVEST - TÍTULO CV SA', nick: 'EASYNVEST', ispb: '62169875', createdAt: new Date(), updatedAt: new Date() },
  { id: '142', name: 'BROKER BRASIL CC LTDA.', nick: 'BROKER BRASIL', ispb: '16944141', createdAt: new Date(), updatedAt: new Date() },
  { id: '143', name: 'TREVISO CC S.A.', nick: 'TREVISO', ispb: '02992317', createdAt: new Date(), updatedAt: new Date() },
  { id: '144', name: 'BEXS BCO DE CAMBIO S.A.', nick: 'BEXS BCO', ispb: '13059145', createdAt: new Date(), updatedAt: new Date() },
  { id: '145', name: 'LEVYCAM CCV LTDA', nick: 'LEVYCAM', ispb: '50579044', createdAt: new Date(), updatedAt: new Date() },
  { id: '146', name: 'GUITTA CC LTDA', nick: 'GUITTA', ispb: '24074692', createdAt: new Date(), updatedAt: new Date() },
  { id: '149', name: 'FACTA S.A. CFI', nick: 'FACTA', ispb: '15581638', createdAt: new Date(), updatedAt: new Date() },
  { id: '157', name: 'ICAP DO BRASIL CTVM LTDA.', nick: 'ICAP', ispb: '09105360', createdAt: new Date(), updatedAt: new Date() },
  { id: '159', name: 'CASA CREDITO S.A. SCM', nick: 'CASA CREDITO', ispb: '05442029', createdAt: new Date(), updatedAt: new Date() },
  { id: '163', name: 'COMMERZBANK BRASIL S.A. - BCO MÚLTIPLO', nick: 'COMMERZBANK BRASIL', ispb: '23522214', createdAt: new Date(), updatedAt: new Date() },
  { id: '169', name: 'BCO OLÉ CONSIGNADO S.A.', nick: 'OLÉ CONSIGNADO', ispb: '71371686', createdAt: new Date(), updatedAt: new Date() },
  { id: '173', name: 'BRL TRUST DTVM SA', nick: 'BRL TRUST', ispb: '13486793', createdAt: new Date(), updatedAt: new Date() },
  { id: '174', name: 'PERNAMBUCANAS FINANC S.A. CFI', nick: 'PERNAMBUCANAS', ispb: '43180355', createdAt: new Date(), updatedAt: new Date() },
  { id: '177', name: 'GUIDE', nick: 'GUIDE', ispb: '65913436', createdAt: new Date(), updatedAt: new Date() },
  { id: '180', name: 'CM CAPITAL MARKETS CCTVM LTDA', nick: 'CM CAPITAL MARKETS', ispb: '02685483', createdAt: new Date(), updatedAt: new Date() },
  { id: '183', name: 'SOCRED SA - SCMEPP', nick: 'SOCRED', ispb: '09210106', createdAt: new Date(), updatedAt: new Date() },
  { id: '184', name: 'BCO ITAÚ BBA S.A.', nick: 'ITAÚ BBA', ispb: '17298092', createdAt: new Date(), updatedAt: new Date() },
  { id: '188', name: 'ATIVA S.A. INVESTIMENTOS CCTVM', nick: 'ATIVA', ispb: '33775974', createdAt: new Date(), updatedAt: new Date() },
  { id: '189', name: 'HS FINANCEIRA', nick: 'HS FINANCEIRA', ispb: '07512441', createdAt: new Date(), updatedAt: new Date() },
  { id: '190', name: 'SERVICOOP', nick: 'SERVICOOP', ispb: '03973814', createdAt: new Date(), updatedAt: new Date() },
  { id: '191', name: 'NOVA FUTURA CTVM LTDA.', nick: 'NOVA FUTURA', ispb: '04257795', createdAt: new Date(), updatedAt: new Date() },
  { id: '194', name: 'PARMETAL DTVM LTDA', nick: 'PARMETAL', ispb: '20155248', createdAt: new Date(), updatedAt: new Date() },
  { id: '196', name: 'FAIR CC S.A.', nick: 'FAIR', ispb: '32648370', createdAt: new Date(), updatedAt: new Date() },
  { id: '197', name: 'STONE PAGAMENTOS S.A.', nick: 'STONE', ispb: '16501555', createdAt: new Date(), updatedAt: new Date() },
  { id: '208', name: 'BANCO BTG PACTUAL S.A.', nick: 'BTG PACTUAL', ispb: '30306294', createdAt: new Date(), updatedAt: new Date() },
  { id: '212', name: 'BANCO ORIGINAL', nick: 'ORIGINAL', ispb: '92894922', createdAt: new Date(), updatedAt: new Date() },
  { id: '213', name: 'BCO ARBI S.A.', nick: 'ARBI', ispb: '54403563', createdAt: new Date(), updatedAt: new Date() },
  { id: '217', name: 'BANCO JOHN DEERE S.A.', nick: 'JOHN DEERE', ispb: '91884981', createdAt: new Date(), updatedAt: new Date() },
  { id: '218', name: 'BCO BS2 S.A.', nick: 'BS2', ispb: '71027866', createdAt: new Date(), updatedAt: new Date() },
  { id: '222', name: 'BCO CRÉDIT AGRICOLE BR S.A.', nick: 'CRÉDIT AGRICOLE BR', ispb: '75647891', createdAt: new Date(), updatedAt: new Date() },
  { id: '224', name: 'BCO FIBRA S.A.', nick: 'FIBRA', ispb: '58616418', createdAt: new Date(), updatedAt: new Date() },
  { id: '233', name: 'BANCO CIFRA', nick: 'CIFRA', ispb: '62421979', createdAt: new Date(), updatedAt: new Date() },
  { id: '237', name: 'BCO BRADESCO S.A.', nick: 'BRADESCO', ispb: '60746948', createdAt: new Date(), updatedAt: new Date() },
  { id: '241', name: 'BCO CLASSICO S.A.', nick: 'CLASSICO', ispb: '31597552', createdAt: new Date(), updatedAt: new Date() },
  { id: '243', name: 'BCO MÁXIMA S.A.', nick: 'MÁXIMA', ispb: '33923798', createdAt: new Date(), updatedAt: new Date() },
  { id: '246', name: 'BCO ABC BRASIL S.A.', nick: 'ABC BRASIL', ispb: '28195667', createdAt: new Date(), updatedAt: new Date() },
  { id: '249', name: 'BANCO INVESTCRED UNIBANCO S.A.', nick: 'INVESTCRED', ispb: '61182408', createdAt: new Date(), updatedAt: new Date() },
  { id: '250', name: 'BCV', nick: 'BCV', ispb: '50585090', createdAt: new Date(), updatedAt: new Date() },
  { id: '253', name: 'BEXS CC S.A.', nick: 'BEXS', ispb: '52937216', createdAt: new Date(), updatedAt: new Date() },
  { id: '254', name: 'PARANA BCO S.A.', nick: 'PARANA', ispb: '14388334', createdAt: new Date(), updatedAt: new Date() },
  { id: '259', name: 'MONEYCORP BCO DE CÂMBIO S.A.', nick: 'MONEYCORP', ispb: '08609934', createdAt: new Date(), updatedAt: new Date() },
  { id: '260', name: 'NU PAGAMENTOS S.A.', nick: 'NUBANK', ispb: '18236120', createdAt: new Date(), updatedAt: new Date() },
  { id: '265', name: 'BCO FATOR S.A.', nick: 'FATOR', ispb: '33644196', createdAt: new Date(), updatedAt: new Date() },
  { id: '266', name: 'BCO CEDULA S.A.', nick: 'CEDULA', ispb: '33132044', createdAt: new Date(), updatedAt: new Date() },
  { id: '268', name: 'BARI CIA HIPOTECÁRIA', nick: 'BARI', ispb: '14511781', createdAt: new Date(), updatedAt: new Date() },
  { id: '269', name: 'BCO HSBC S.A.', nick: 'HSBC', ispb: '53518684', createdAt: new Date(), updatedAt: new Date() },
  { id: '270', name: 'SAGITUR CC LTDA', nick: 'SAGITUR', ispb: '61444949', createdAt: new Date(), updatedAt: new Date() },
  { id: '271', name: 'IB CCTVM S.A.', nick: 'IB', ispb: '27842177', createdAt: new Date(), updatedAt: new Date() },
  { id: '272', name: 'AGK CC S.A.', nick: 'AGK', ispb: '00250699', createdAt: new Date(), updatedAt: new Date() },
  { id: '273', name: 'CCR DE SÃO MIGUEL DO OESTE', nick: 'CCR', ispb: '08253539', createdAt: new Date(), updatedAt: new Date() },
  { id: '274', name: 'MONEY PLUS SCMEPP LTDA', nick: 'MONEY PLUS', ispb: '11581339', createdAt: new Date(), updatedAt: new Date() },
  { id: '276', name: 'SENFF S.A. - CFI', nick: 'SENFF', ispb: '11970623', createdAt: new Date(), updatedAt: new Date() },
  { id: '278', name: 'GENIAL INVESTIMENTOS CVM S.A.', nick: 'GE ', ispb: '27652684', createdAt: new Date(), updatedAt: new Date() },
  { id: '279', name: 'CCR DE PRIMAVERA DO LESTE', nick: 'CCR', ispb: '26563270', createdAt: new Date(), updatedAt: new Date() },
  { id: '280', name: 'AVISTA S.A. CFI', nick: 'AVISTA', ispb: '23862762', createdAt: new Date(), updatedAt: new Date() },
  { id: '281', name: 'CCR COOPAVEL', nick: 'CCR', ispb: '76461557', createdAt: new Date(), updatedAt: new Date() },
  { id: '283', name: 'RB CAPITAL INVESTIMENTOS DTVM LTDA.', nick: 'RB CAPITAL', ispb: '89960090', createdAt: new Date(), updatedAt: new Date() },
  { id: '285', name: 'FRENTE CC LTDA.', nick: 'FRENTE', ispb: '71677850', createdAt: new Date(), updatedAt: new Date() },
  { id: '286', name: 'CCR DE OURO', nick: 'CCR', ispb: '07853842', createdAt: new Date(), updatedAt: new Date() },
  { id: '288', name: 'CAROL DTVM LTDA.', nick: 'CAROL', ispb: '62237649', createdAt: new Date(), updatedAt: new Date() },
  { id: '289', name: 'DECYSEO CC LTDA.', nick: 'DECYSEO', ispb: '94968518', createdAt: new Date(), updatedAt: new Date() },
  { id: '290', name: 'PAGSEGURO', nick: 'PAGSEGURO', ispb: '08561701', createdAt: new Date(), updatedAt: new Date() },
  { id: '292', name: 'BS2 DTVM S.A.', nick: 'BS2', ispb: '28650236', createdAt: new Date(), updatedAt: new Date() },
  { id: '293', name: 'LASTRO RDV DTVM LTDA', nick: 'LASTRO', ispb: '71590442', createdAt: new Date(), updatedAt: new Date() },
  { id: '296', name: 'VISION S.A. CC', nick: 'VISION', ispb: '04062902', createdAt: new Date(), updatedAt: new Date() },
  { id: '298', name: 'VIPS CC LTDA.', nick: 'VIPS', ispb: '17772370', createdAt: new Date(), updatedAt: new Date() },
  { id: '299', name: 'SOROCRED CFI S.A.', nick: 'SOROCRED', ispb: '04814563', createdAt: new Date(), updatedAt: new Date() },
  { id: '300', name: 'BCO LA NACION ARGENTINA', nick: 'LA NACION ARGENTINA', ispb: '33042151', createdAt: new Date(), updatedAt: new Date() },
  { id: '301', name: 'BPP IP S.A.', nick: 'BPP', ispb: '13370835', createdAt: new Date(), updatedAt: new Date() },
  { id: '306', name: 'PORTOPAR DTVM LTDA', nick: 'PORTOPAR', ispb: '40303299', createdAt: new Date(), updatedAt: new Date() },
  { id: '307', name: 'TERRA INVESTIMENTOS DTVM', nick: 'TERRA', ispb: '03751794', createdAt: new Date(), updatedAt: new Date() },
  { id: '309', name: 'CAMBIONET CC LTDA', nick: 'CAMBIONET', ispb: '14190547', createdAt: new Date(), updatedAt: new Date() },
  { id: '310', name: 'VORTX DTVM LTDA.', nick: 'VORTX', ispb: '22610500', createdAt: new Date(), updatedAt: new Date() },
  { id: '313', name: 'AMAZÔNIA CC LTDA.', nick: 'AMAZÔNIA', ispb: '16927221', createdAt: new Date(), updatedAt: new Date() },
  { id: '315', name: 'PI DTVM S.A.', nick: 'PI', ispb: '03502968', createdAt: new Date(), updatedAt: new Date() },
  { id: '318', name: 'BCO BMG S.A.', nick: 'BMG', ispb: '61186680', createdAt: new Date(), updatedAt: new Date() },
  { id: '319', name: 'OM DTVM LTDA', nick: 'OM', ispb: '11495073', createdAt: new Date(), updatedAt: new Date() },
  { id: '320', name: 'BCO CCB BRASIL S.A.', nick: 'CCB', ispb: '07450604', createdAt: new Date(), updatedAt: new Date() },
  { id: '321', name: 'CREFAZ SCMEPP LTDA', nick: 'CREFAZ', ispb: '18188384', createdAt: new Date(), updatedAt: new Date() },
  { id: '322', name: 'CCR DE ABELARDO LUZ', nick: 'CCR', ispb: '01073966', createdAt: new Date(), updatedAt: new Date() },
  { id: '323', name: 'MERCADO PAGO', nick: 'MERCADO PAGO', ispb: '10573521', createdAt: new Date(), updatedAt: new Date() },
  { id: '324', name: 'CARTOS SCD S.A.', nick: 'CARTOS', ispb: '21332862', createdAt: new Date(), updatedAt: new Date() },
  { id: '325', name: 'ÓRAMA DTVM S.A.', nick: 'ÓRAMA', ispb: '13293225', createdAt: new Date(), updatedAt: new Date() },
  { id: '326', name: 'PARATI - CFI S.A.', nick: 'PARATI', ispb: '03311443', createdAt: new Date(), updatedAt: new Date() },
  { id: '329', name: 'QI SCD S.A.', nick: 'QI', ispb: '32402502', createdAt: new Date(), updatedAt: new Date() },
  { id: '330', name: 'BANCO BARI S.A.', nick: 'BARI', ispb: '00556603', createdAt: new Date(), updatedAt: new Date() },
  { id: '331', name: 'FRAM CAPITAL DTVM S.A.', nick: 'FRAM', ispb: '13673855', createdAt: new Date(), updatedAt: new Date() },
  { id: '332', name: 'ACESSO SOLUCOES PAGAMENTO SA', nick: 'ACESSO', ispb: '13140088', createdAt: new Date(), updatedAt: new Date() },
  { id: '335', name: 'BANCO DIGIO', nick: 'DIGIO', ispb: '27098060', createdAt: new Date(), updatedAt: new Date() },
  { id: '336', name: 'BCO C6 S.A.', nick: 'C6', ispb: '31872495', createdAt: new Date(), updatedAt: new Date() },
  { id: '340', name: 'SUPER PAGAMENTOS E ADMINISTRACAO DE MEIOS ELETRONICOS S.A.', nick: 'SUPER PAGTOS', ispb: '09554480', createdAt: new Date(), updatedAt: new Date() },
  { id: '341', name: 'ITAÚ UNIBANCO S.A.', nick: 'ITAÚ', ispb: '60701190', createdAt: new Date(), updatedAt: new Date() },
  { id: '342', name: 'CREDITAS SCD', nick: 'CREDITAS', ispb: '32997490', createdAt: new Date(), updatedAt: new Date() },
  { id: '343', name: 'FFA SCMEPP LTDA.', nick: 'FFA SCMEPP', ispb: '24537861', createdAt: new Date(), updatedAt: new Date() },
  { id: '348', name: 'BCO XP S.A.', nick: 'XP', ispb: '33264668', createdAt: new Date(), updatedAt: new Date() },
  { id: '349', name: 'AMAGGI S.A. CFI', nick: 'AMAGGI', ispb: '27214112', createdAt: new Date(), updatedAt: new Date() },
  { id: '350', name: 'CREHNOR LARANJEIRAS', nick: 'CREHNOR', ispb: '01330387', createdAt: new Date(), updatedAt: new Date() },
  { id: '352', name: 'TORO CTVM LTDA', nick: 'TORO', ispb: '29162769', createdAt: new Date(), updatedAt: new Date() },
  { id: '354', name: 'NECTON INVESTIMENTOS S.A CVM', nick: 'NECTON', ispb: '52904364', createdAt: new Date(), updatedAt: new Date() },
  { id: '355', name: 'ÓTIMO SCD S.A.', nick: 'ÓTIMO', ispb: '34335592', createdAt: new Date(), updatedAt: new Date() },
  { id: '359', name: 'ZEMA CFI S/A', nick: 'ZEMA', ispb: '05351887', createdAt: new Date(), updatedAt: new Date() },
  { id: '360', name: 'TRINUS CAPITAL DTVM', nick: 'TRINUS', ispb: '02276653', createdAt: new Date(), updatedAt: new Date() },
  { id: '362', name: 'CIELO S.A.', nick: 'CIELO', ispb: '01027058', createdAt: new Date(), updatedAt: new Date() },
  { id: '363', name: 'SOCOPA SC PAULISTA S.A.', nick: 'SOCOPA', ispb: '62285390', createdAt: new Date(), updatedAt: new Date() },
  { id: '364', name: 'GERENCIANET PAGTOS BRASIL LTDA', nick: 'GERENCIANET', ispb: '09089356', createdAt: new Date(), updatedAt: new Date() },
  { id: '365', name: 'SOLIDUS S.A. CCVM', nick: 'SOLIDUS', ispb: '68757681', createdAt: new Date(), updatedAt: new Date() },
  { id: '366', name: 'BCO SOCIETE GENERALE BRASIL', nick: 'SOCIETE GENERALE', ispb: '61533584', createdAt: new Date(), updatedAt: new Date() },
  { id: '367', name: 'VITREO DTVM S.A.', nick: 'VITREO', ispb: '34711571', createdAt: new Date(), updatedAt: new Date() },
  { id: '368', name: 'BCO CSF S.A.', nick: 'CSF', ispb: '08357240', createdAt: new Date(), updatedAt: new Date() },
  { id: '370', name: 'BCO MIZUHO S.A.', nick: 'MIZUHO', ispb: '61088183', createdAt: new Date(), updatedAt: new Date() },
  { id: '371', name: 'WARREN CVMC LTDA', nick: 'WARREN', ispb: '92875780', createdAt: new Date(), updatedAt: new Date() },
  { id: '373', name: 'UP.P SEP S.A.', nick: 'UP.P SEP', ispb: '35977097', createdAt: new Date(), updatedAt: new Date() },
  { id: '374', name: 'REALIZE CFI S.A.', nick: 'REALIZE', ispb: '27351731', createdAt: new Date(), updatedAt: new Date() },
  { id: '376', name: 'BCO J.P. MORGAN S.A.', nick: 'J.P. MORGAN', ispb: '33172537', createdAt: new Date(), updatedAt: new Date() },
  { id: '378', name: 'BBC LEASING', nick: 'BBC LEASING', ispb: '01852137', createdAt: new Date(), updatedAt: new Date() },
  { id: '379', name: 'CECM COOPERFORTE', nick: 'CECM COOPERFORTE', ispb: '01658426', createdAt: new Date(), updatedAt: new Date() },
  { id: '381', name: 'BCO MERCEDES-BENZ S.A.', nick: 'MERCEDES-BENZ', ispb: '60814191', createdAt: new Date(), updatedAt: new Date() },
  { id: '382', name: 'FIDUCIA SCMEPP LTDA', nick: 'FIDUCIA SCMEPP', ispb: '04307598', createdAt: new Date(), updatedAt: new Date() },
  { id: '383', name: 'JUNO', nick: 'JUNO', ispb: '21018182', createdAt: new Date(), updatedAt: new Date() },
  { id: '387', name: 'BCO TOYOTA DO BRASIL S.A.', nick: 'TOYOTA', ispb: '03215790', createdAt: new Date(), updatedAt: new Date() },
  { id: '389', name: 'BCO MERCANTIL DO BRASIL S.A.', nick: 'MERCANTIL', ispb: '17184037', createdAt: new Date(), updatedAt: new Date() },
  { id: '390', name: 'BCO GM S.A.', nick: 'GM', ispb: '59274605', createdAt: new Date(), updatedAt: new Date() },
  { id: '391', name: 'CCR DE IBIAM', nick: 'CCR DE IBIAM', ispb: '08240446', createdAt: new Date(), updatedAt: new Date() },
  { id: '393', name: 'BCO VOLKSWAGEN S.A', nick: 'VOLKSWAGEN', ispb: '59109165', createdAt: new Date(), updatedAt: new Date() },
  { id: '394', name: 'BCO BRADESCO FINANC. S.A.', nick: 'BRADESCO FINANC', ispb: '07207996', createdAt: new Date(), updatedAt: new Date() },
  { id: '396', name: 'HUB PAGAMENTOS', nick: 'HUB', ispb: '13884775', createdAt: new Date(), updatedAt: new Date() },
  { id: '399', name: 'KIRTON BANK', nick: 'KIRTON BANK', ispb: '01701201', createdAt: new Date(), updatedAt: new Date() },
  { id: '412', name: 'BCO CAPITAL S.A.', nick: 'CAPITAL', ispb: '15173776', createdAt: new Date(), updatedAt: new Date() },
  { id: '422', name: 'BCO SAFRA S.A.', nick: 'SAFRA', ispb: '58160789', createdAt: new Date(), updatedAt: new Date() },
  { id: '456', name: 'BCO MUFG BRASIL S.A.', nick: 'MUFG BRASIL', ispb: '60498557', createdAt: new Date(), updatedAt: new Date() },
  { id: '464', name: 'BCO SUMITOMO MITSUI BRASIL S.A.', nick: 'SUMITOMO MITSUI', ispb: '60518222', createdAt: new Date(), updatedAt: new Date() },
  { id: '473', name: 'BCO CAIXA GERAL BRASIL S.A.', nick: 'CAIXA GERAL BRASIL', ispb: '33466988', createdAt: new Date(), updatedAt: new Date() },
  { id: '477', name: 'CITIBANK N.A.', nick: 'CITIBANK', ispb: '33042953', createdAt: new Date(), updatedAt: new Date() },
  { id: '479', name: 'BCO ITAUBANK S.A.', nick: 'ITAUBANK', ispb: '60394079', createdAt: new Date(), updatedAt: new Date() },
  { id: '487', name: 'DEUTSCHE BANK S.A.BCO ALEMAO', nick: 'DEUTSCHE BANK', ispb: '62331228', createdAt: new Date(), updatedAt: new Date() },
  { id: '488', name: 'JPMORGAN CHASE BANK', nick: 'JPMORGAN CHASE', ispb: '46518205', createdAt: new Date(), updatedAt: new Date() },
  { id: '492', name: 'ING BANK N.V.', nick: 'ING', ispb: '49336860', createdAt: new Date(), updatedAt: new Date() },
  { id: '495', name: 'BCO LA PROVINCIA B AIRES BCE', nick: 'LA PROVINCIA', ispb: '44189447', createdAt: new Date(), updatedAt: new Date() },
  { id: '505', name: 'BCO CREDIT SUISSE S.A.', nick: 'CREDIT SUISSE', ispb: '32062580', createdAt: new Date(), updatedAt: new Date() },
  { id: '545', name: 'SENSO CCVM S.A.', nick: 'SENSO', ispb: '17352220', createdAt: new Date(), updatedAt: new Date() },
  { id: '600', name: 'BCO LUSO BRASILEIRO S.A.', nick: 'LUSO BRASILEIRO', ispb: '59118133', createdAt: new Date(), updatedAt: new Date() },
  { id: '604', name: 'BCO INDUSTRIAL DO BRASIL S.A.', nick: 'INDUSTRIAL', ispb: '31895683', createdAt: new Date(), updatedAt: new Date() },
  { id: '610', name: 'BCO VR S.A.', nick: 'VR', ispb: '78626983', createdAt: new Date(), updatedAt: new Date() },
  { id: '611', name: 'BCO PAULISTA S.A.', nick: 'PAULISTA', ispb: '61820817', createdAt: new Date(), updatedAt: new Date() },
  { id: '612', name: 'BCO GUANABARA S.A.', nick: 'GUANABARA', ispb: '31880826', createdAt: new Date(), updatedAt: new Date() },
  { id: '613', name: 'OMNI BANCO S.A.', nick: 'OMNI', ispb: '60850229', createdAt: new Date(), updatedAt: new Date() },
  { id: '623', name: 'BANCO PAN', nick: 'PAN', ispb: '59285411', createdAt: new Date(), updatedAt: new Date() },
  { id: '626', name: 'BCO C6 CONSIG', nick: 'C6', ispb: '61348538', createdAt: new Date(), updatedAt: new Date() },
  { id: '630', name: 'SMARTBANK', nick: 'SMARTBANK', ispb: '58497702', createdAt: new Date(), updatedAt: new Date() },
  { id: '633', name: 'BCO RENDIMENTO S.A.', nick: 'RENDIMENTO', ispb: '68900810', createdAt: new Date(), updatedAt: new Date() },
  { id: '634', name: 'BCO TRIANGULO S.A.', nick: 'TRIANGULO', ispb: '17351180', createdAt: new Date(), updatedAt: new Date() },
  { id: '637', name: 'BCO SOFISA S.A.', nick: 'SOFISA', ispb: '60889128', createdAt: new Date(), updatedAt: new Date() },
  { id: '643', name: 'BCO PINE S.A.', nick: 'PINE', ispb: '62144175', createdAt: new Date(), updatedAt: new Date() },
  { id: '652', name: 'ITAÚ UNIBANCO HOLDING S.A.', nick: 'ITAÚ HOLDING', ispb: '60872504', createdAt: new Date(), updatedAt: new Date() },
  { id: '653', name: 'BCO INDUSVAL S.A.', nick: 'INDUSVAL', ispb: '61024352', createdAt: new Date(), updatedAt: new Date() },
  { id: '654', name: 'BCO DIGIMAIS S.A.', nick: 'DIGIMAIS', ispb: '92874270', createdAt: new Date(), updatedAt: new Date() },
  { id: '655', name: 'BCO VOTORANTIM S.A.', nick: 'VOTORANTIM', ispb: '59588111', createdAt: new Date(), updatedAt: new Date() },
  { id: '707', name: 'BCO DAYCOVAL S.A', nick: 'DAYCOVAL', ispb: '62232889', createdAt: new Date(), updatedAt: new Date() },
  { id: '712', name: 'BCO OURINVEST S.A.', nick: 'OURINVEST', ispb: '78632767', createdAt: new Date(), updatedAt: new Date() },
  { id: '739', name: 'BCO CETELEM S.A.', nick: 'CETELEM', ispb: '00558456', createdAt: new Date(), updatedAt: new Date() },
  { id: '741', name: 'BCO RIBEIRAO PRETO S.A.', nick: 'RIBEIRAO PRETO', ispb: '00517645', createdAt: new Date(), updatedAt: new Date() },
  { id: '743', name: 'BANCO SEMEAR', nick: 'SEMEAR', ispb: '00795423', createdAt: new Date(), updatedAt: new Date() },
  { id: '745', name: 'BCO CITIBANK S.A.', nick: 'CITIBANK', ispb: '33479023', createdAt: new Date(), updatedAt: new Date() },
  { id: '746', name: 'BCO MODAL S.A.', nick: 'MODAL', ispb: '30723886', createdAt: new Date(), updatedAt: new Date() },
  { id: '747', name: 'BCO RABOBANK INTL BRASIL S.A.', nick: 'RABOBANK', ispb: '01023570', createdAt: new Date(), updatedAt: new Date() },
  { id: '748', name: 'BCO COOPERATIVO SICREDI S.A.', nick: 'SICREDI', ispb: '01181521', createdAt: new Date(), updatedAt: new Date() },
  { id: '751', name: 'SCOTIABANK BRASIL', nick: 'SCOTIABANK', ispb: '29030467', createdAt: new Date(), updatedAt: new Date() },
  { id: '752', name: 'BCO BNP PARIBAS BRASIL S A', nick: 'BNP PARIBAS', ispb: '01522368', createdAt: new Date(), updatedAt: new Date() },
  { id: '753', name: 'NOVO BCO CONTINENTAL S.A. - BM', nick: 'CONTINENTAL', ispb: '74828799', createdAt: new Date(), updatedAt: new Date() },
  { id: '754', name: 'BANCO SISTEMA', nick: 'SISTEMA', ispb: '76543115', createdAt: new Date(), updatedAt: new Date() },
  { id: '755', name: 'BOFA MERRILL LYNCH BM S.A.', nick: 'BOFA MERRILL', ispb: '62073200', createdAt: new Date(), updatedAt: new Date() },
  { id: '756', name: 'BANCOOB', nick: 'BANCOOB', ispb: '02038232', createdAt: new Date(), updatedAt: new Date() },
  { id: '757', name: 'BCO KEB HANA DO BRASIL S.A.', nick: 'KEB HANA', ispb: '02318507', createdAt: new Date(), updatedAt: new Date() },
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(tableName, content, {});
  },

  down: async (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete(tableName, null, {});
  }
};
