// Types for the parts of js-beautify that HandyWeb uses. The package ships no types.

interface BeautifyOptions {
    indent_size?: number;
    indent_char?: string;
    indent_with_tabs?: boolean;
    end_with_newline?: boolean;
    preserve_newlines?: boolean;
    max_preserve_newlines?: number;
    wrap_line_length?: number;
    brace_style?: string;
    space_in_empty_paren?: boolean;
    indent_inner_html?: boolean;
    extra_liners?: string[];
}

declare module "js-beautify/js/lib/beautify.js" {
    export function js_beautify(source: string, options?: BeautifyOptions): string;
}

declare module "js-beautify/js/lib/beautify-css.js" {
    export function css_beautify(source: string, options?: BeautifyOptions): string;
}

declare module "js-beautify/js/lib/beautify-html.js" {
    export function html_beautify(source: string, options?: BeautifyOptions): string;
}
