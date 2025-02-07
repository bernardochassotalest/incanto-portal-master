import _ from "lodash";
import mongoose from "mongoose";
import { stringDate } from "../../../../../lib/utils";
import schema from "./schema";

const getFilter = (params) => {
	let from = _.get(params, "from", ""),
		to = _.get(params, "to", ""),
		result = {
			registro: { $in: ["034", "036"] },
			dt_lancamento: { $gte: stringDate(from), $lte: stringDate(to) },
		};

	return result;
};

schema.statics.listCsv = async function (params) {
	let pipeline = [],
		result = [],
		filter = getFilter(params),
		project = {
			nro_pv: "$nro_pv_original",
			nro_rv: "$nro_rv",
			data_rv: "$data_rv",
			nro_documento: "$nro_documento",
			nro_parcela: "$nro_parcela",
			banco: "$banco",
			agencia: "$agencia",
			conta_corrente: "$conta_corrente",
			bandeira: "$bandeira.name",
			dt_lancamento: "$dt_lancamento",
			vl_lancamento: "$vl_lancamento",
		},
		sort = {
			dt_lancamento: 1,
		};

	pipeline.push({ $match: filter });
	pipeline.push({ $project: project });
	pipeline.push({ $sort: sort });

	try {
		result = await this.aggregate(pipeline);
	} catch (error) {
		throw error;
	}

	return result;
};

export default mongoose.model(
	"cldr_rede_financeiro_genneral",
	schema,
	"c_cldr_rede_financeiro"
);
