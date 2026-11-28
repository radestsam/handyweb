import {
    formatDialect,
    mariadb,
    mysql,
    postgresql,
    sql,
    sqlite,
    transactsql,
    type DialectOptions,
} from "sql-formatter";
import { ToolFailure } from "@handyweb/core/runtime";

export const DIALECTS = {
    sql,
    postgresql,
    mysql,
    mariadb,
    sqlite,
    transactsql,
} as const satisfies Record<string, DialectOptions>;
export type Dialect = keyof typeof DIALECTS;
export const DIALECT_NAMES: readonly Dialect[] = [
    "sql",
    "postgresql",
    "mysql",
    "mariadb",
    "sqlite",
    "transactsql",
];
export const DIALECT_LABELS: Record<Dialect, string> = {
    sql: "Standard SQL",
    postgresql: "PostgreSQL",
    mysql: "MySQL",
    mariadb: "MariaDB",
    sqlite: "SQLite",
    transactsql: "SQL Server",
};

export type KeywordCase = "upper" | "lower" | "preserve";

export interface SqlOptions {
    dialect: Dialect;
    keywordCase: KeywordCase;
    indent: 2 | 4;
}

/** Formats SQL with sql-formatter. A parse error gives its line and column. */
export function formatSql(text: string, options: SqlOptions): string {
    if (text.trim() === "") {
        throw new ToolFailure(
            "invalid-input",
            { fa: "ورودی خالی است.", en: "The input is empty." },
            "empty",
        );
    }
    try {
        return formatDialect(text, {
            dialect: DIALECTS[options.dialect],
            keywordCase: options.keywordCase,
            tabWidth: options.indent,
            linesBetweenQueries: 1,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const position = /line (\d+) column (\d+)/i.exec(message);
        const where = position
            ? {
                  fa: ` (خط ${position[1]}، ستون ${position[2]})`,
                  en: ` (line ${position[1]}, column ${position[2]})`,
              }
            : { fa: "", en: "" };
        throw new ToolFailure(
            "invalid-input",
            {
                fa: `این SQL خوانده نشد${where.fa}. شاید گویش دیگری را برگزینید.`,
                en: `This SQL could not be read${where.en}. Try another dialect.`,
            },
            message.split("\n")[0],
        );
    }
}
