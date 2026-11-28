import rootPackage from "../../../package.json";

/** The repository on GitHub. */
export const REPOSITORY = "https://github.com/radestsam/handyweb";

/**
 * The tag of this release: `v` and the version of the root package.json. A
 * release is tagged with this name, so a link to it opens the code that the
 * site runs.
 */
export const RELEASE_TAG = `v${rootPackage.version}`;

/** The source folder of a tool at this release. */
export function toolSourceUrl(category: string, id: string): string {
    return `${REPOSITORY}/tree/${RELEASE_TAG}/packages/tools/src/${category}/${id}`;
}

/** The facts about a tool that a problem report starts with. */
export interface ToolIssue {
    /** The id of the tool, for example `base64`. */
    id: string;
    /** The English title of the tool. */
    title: string;
    /** The privacy mode of the tool. */
    privacy: string;
    /** The canonical URL of the tool page. */
    page: string;
}

/**
 * The URL of a new GitHub issue for a problem with a tool. It opens the bug
 * form (`.github/ISSUE_TEMPLATE/bug.yml`) with the title, the page, the tool,
 * and the release filled in. Each query key is the id of a form field. The
 * URL holds only static facts about the tool. It never holds user input.
 */
export function toolIssueUrl(tool: ToolIssue): string {
    const query = new URLSearchParams({
        template: "bug.yml",
        title: `[${tool.id}] `,
        page: tool.page,
        tool: `${tool.title} (${tool.id}, ${tool.privacy})`,
        version: RELEASE_TAG,
    });
    return `${REPOSITORY}/issues/new?${query.toString()}`;
}
