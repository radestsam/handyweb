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
