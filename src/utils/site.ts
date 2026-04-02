export function withBase(path: string) {
	if (!path) {
		return path;
	}

	if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('mailto:') || path.startsWith('#')) {
		return path;
	}

	const base = import.meta.env.BASE_URL.endsWith('/')
		? import.meta.env.BASE_URL
		: `${import.meta.env.BASE_URL}/`;

	return `${base}${path.replace(/^\/+/, '')}`;
}

export function stripBase(pathname: string) {
	const base = import.meta.env.BASE_URL;

	if (base !== '/' && pathname.startsWith(base)) {
		return pathname.slice(base.length - 1) || '/';
	}

	return pathname;
}
