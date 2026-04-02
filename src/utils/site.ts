export function withBase(path: string) {
	if (!path) {
		return path;
	}

	if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('mailto:') || path.startsWith('#')) {
		return path;
	}

	return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}

export function stripBase(pathname: string) {
	const base = import.meta.env.BASE_URL;

	if (base !== '/' && pathname.startsWith(base)) {
		return pathname.slice(base.length - 1) || '/';
	}

	return pathname;
}
