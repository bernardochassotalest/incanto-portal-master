import bodyParser from "body-parser";
import colors from "colors";
import compress from "compression";
import cors from "cors";
import express from "express";
import http from "http";
import _ from "lodash";
import methodOverride from "method-override";
import path from "path";
import responseTime from "response-time";
import tracer from "tracer";

export const dynamicLoad = (p) => import(p);

export function getAllPermissions(accountType) {
  let list = _.filter(global.system.acls, (item) =>
      item.accounts.includes(accountType)
    ),
    permissions = [];

  _.each(list, (acl) => {
    let perms = acl.permissions ? acl.permissions.join(",") : "";
    permissions.push(`${acl.code}${perms ? "+" : ""}${perms}`);
  });

  return permissions.join(";");
}

export function prepareAllRules(accountType) {
  return _.filter(global.system.acls, (item) =>
    item.accounts.includes(accountType)
  );
}

export function prepareUserRules(authField, accountType) {
  let list = _.filter(global.system.menu, (item) =>
      item.accounts.includes(accountType)
    ),
    baseAuthStr = String(`${authField};`)
      .replace(/(\+(.*?);)/g, ";")
      .replace(/;$/, ""),
    baseAuthList = _.filter(String(authField).split(";"), (r) => /\+/.test(r)),
    baseAuthMap = {},
    authRegexp = new RegExp(`^(${String(baseAuthStr).replace(/;/g, "|")})`),
    data = [];

  _.each(baseAuthList, (token) => {
    let parts = String(token).split("+");
    baseAuthMap[parts[0]] = String(parts[1]).split(",");
  });

  _.each(list, (r) => {
    if (!authField || authRegexp.test(r.code)) {
      let leaf = _.pick(r, 'label', 'code', 'path', 'icon', 'permissions', 'group', 'groupIcon');
      leaf.id = _.kebabCase(leaf.path);
      leaf.perms = baseAuthMap[r.code] || null;
      data.push(leaf);
    }
  });
  return data;
}

export function getAuthKey(module) {
  const modulesMap = _.chain(global.system.menu)
    .map((r) => _.pick(r, "code", "path"))
    .keyBy("path")
    .value();

  return _.get(modulesMap[module], "code") || "";
}

export function getArrayFromText(authText) {
  let array = [],
    parts = String(authText).split(";");

  _.each(parts, (part) => {
    let tokens = String(part).split("+");
    array.push({
      code: tokens[0],
      perms: !tokens[1] ? [] : tokens[1].split(","),
    });
  });
  return array;
}

export function getTextfromArray(array) {
  let tokens = [];

  for (let index in array) {
    let val = array[index],
      str = "";
    if (val && _.size(val.perms) > 0) {
      str = `+${val.perms.join(",")}`;
    }
    tokens.push(`${val.code}${str}`);
  }
  return tokens.join(";");
}

export const logger = function (options, title) {
  const {
    fileLog = false,
    level = "log",
    path = "",
    maxLogFiles = 10,
  } = options;
  const params = {
    level,
    format: [
      "{{timestamp}} [{{title}}] ({{file}}:{{line}}) {{message}} ",
      {
        error:
          "{{timestamp}} [{{title}}] ({{file}}:{{line}}) {{message}}\nCall Stack:\n{{stack}}",
      },
    ],
    filters: {
      log: colors.cyan,
      trace: colors.magenta,
      debug: colors.yellow,
      info: colors.blue,
      warn: colors.yellow.bgBlue,
      error: colors.red,
    },
  };

  const dailyfile = _.merge({}, params, {
    root: path,
    allLogsFileName: title,
    maxLogFiles,
  });

  const logger = fileLog ? tracer.dailyfile(dailyfile) : tracer.console(params);

  return logger;
};

export const server = function () {
  const app = express();
  const httpServer = http.Server(app);
  const bodyLimit = process.env.BODY_DATA_LIMIT || "100mb";

  app.set("json spaces", 2);
  app.disable("x-powered-by");
  app.options("*", cors());
  app.use(compress());
  app.use(responseTime());
  app.use(express.static(path.join(__dirname, "../public/")));
  app.use(bodyParser.urlencoded({ limit: bodyLimit, extended: true }));
  app.use(bodyParser.json({ limit: bodyLimit }));
  app.use(methodOverride());
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
  );

  app.run = async function (logger, port, name) {
    await httpServer.listen(port, () =>
      logger.log(`${name} running on port ${port}`)
    );
    httpServer.timeout = 10 * 1000 * 60;
  };

  return { app, server: httpServer };
};
