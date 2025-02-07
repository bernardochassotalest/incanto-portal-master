import path from "path";

export const getEnviromentFile = () => {
	const envFile = process.env.NODE_ENV === "development" ? ".development" : "";
	return path.resolve(__dirname, `../../.env${envFile}`);
};

export const onlyNumbers = (value) => {
  if (!value) {
    return null;
  }
  return value.replace(/[^0-9]/g, '');
}
