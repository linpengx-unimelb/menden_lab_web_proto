export type MemberCategory = 'leadership' | 'postdoc' | 'phd' | 'masters' | 'honours';

export interface MemberLink {
	label: string;
	href: string;
}

export type Member = {
	slug: string;
	name: string;
	role: string;
	category: MemberCategory;
	initials: string;
	photo?: string;
	email?: string;
	affiliation?: string;
	researchInterest: string;
	bio?: string;
	github?: string;
	linkedin?: string;
	links?: MemberLink[];
	featured?: boolean;
};

export const categoryLabels: Record<MemberCategory, string> = {
	leadership: 'Leadership',
	postdoc: 'Postdoctoral Researchers',
	phd: 'PhD Students',
	masters: 'Masters Students',
	honours: 'Honours Students',
};

export const members: Member[] = [
	{
		slug: 'michael-menden',
		name: 'A/Prof Michael Menden',
		role: 'Associate Professor',
		category: 'leadership',
		initials: 'MM',
		photo: '/people/michael-menden.jpg',
		email: 'michael.menden@unimelb.edu.au',
		affiliation: 'University of Melbourne and Helmholtz Munich',
		researchInterest:
			'Michael Menden is an Associate Professor at the University of Melbourne and a jointly appointed Principal Investigator at Helmholtz Munich. His research sits at the intersection of computational biomedicine, biostatistics, machine learning, and translational pharmacogenomics.',
		bio:
			'His current programme focuses on clinically grounded models for drug response, biomarker discovery, patient stratification, digital twins, and AI-enabled precision medicine across cancer and broader translational disease settings.',
		github: 'https://github.com/MendenLab',
		linkedin: 'https://www.linkedin.com/in/michael-menden-00366647/',
		links: [{ label: 'Lab GitHub', href: 'https://github.com/MendenLab' }],
		featured: true,
	},
	{
		slug: 'postdoctoral-researcher-01',
		name: 'Postdoctoral Researcher 01',
		role: 'Postdoctoral Researcher',
		category: 'postdoc',
		initials: 'PD',
		researchInterest:
			'text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text',
		bio:
			'Replace this placeholder with a focused summary of the researcher\'s programme, methods, and current collaborations, then add GitHub, LinkedIn, and selected outputs.',
	},
	{
		slug: 'phd-student-01',
		name: 'Alina J Arneth',
		role: 'PhD Student',
		category: 'phd',
		initials: 'AA',
		photo: '/people/Alina-J-Arneth_picture.jpeg',
		researchInterest:
			'text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text',
		bio:
			'The student profile can highlight a specific disease area, preferred computational tools, and the biological questions driving the work. Replace this placeholder with a concise project-specific summary plus links to public outputs.',
	},
	{
		slug: 'phd-student-02',
		name: 'Chen Gong',
		role: 'PhD Student',
		category: 'phd',
		initials: 'CG',
		photo: '/people/Chen-Gong.jpg',
		researchInterest:
			'text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text',
		bio:
			'Update this profile later with Chen\'s project-specific description, public links, and any selected outputs. The current copy is intentionally lightweight so the page reads cleanly before the final content is ready.',
	},
	{
		slug: 'phd-student-03',
		name: 'PhD Student 03',
		role: 'PhD Student',
		category: 'phd',
		initials: 'P3',
		researchInterest:
			'text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text',
		bio:
			'Use this space for a short summary of the student\'s specific research direction, such as CRISPR screen analysis, patient stratification, foundation models, or integrative methods for precision medicine studies.',
	},
	{
		slug: 'phd-student-04',
		name: 'PhD Student 04',
		role: 'PhD Student',
		category: 'phd',
		initials: 'P4',
		researchInterest:
			'text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text',
		bio:
			'A good final version should explain the main question, the disease context, and the computational or statistical approach in about 50 words, followed by links to publications, datasets, or project pages.',
	},
	{
		slug: 'phd-student-05',
		name: 'PhD Student 05',
		role: 'PhD Student',
		category: 'phd',
		initials: 'P5',
		researchInterest:
			'text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text',
		bio:
			'Replace this placeholder with a short, readable introduction that states the project area, techniques, and broader motivation. Keep the summary accessible to visitors outside the immediate field while still communicating scientific depth.',
	},
	{
		slug: 'phd-student-06',
		name: 'PhD Student 06',
		role: 'PhD Student',
		category: 'phd',
		initials: 'P6',
		researchInterest:
			'text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text',
		bio:
			'The final profile should briefly describe the student\'s scientific interests and analytic focus, then link out to any public repositories, posters, preprints, or collaborator pages.',
	},
	{
		slug: 'phd-student-07',
		name: 'PhD Student 07',
		role: 'PhD Student',
		category: 'phd',
		initials: 'P7',
		researchInterest:
			'text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text',
		bio:
			'Later, replace the placeholder text with a short statement of the student\'s core research question, computational toolkit, and current project. Add public links only when they are ready.',
	},
	{
		slug: 'phd-student-08',
		name: 'PhD Student 08',
		role: 'PhD Student',
		category: 'phd',
		initials: 'P8',
		researchInterest:
			'text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text',
		bio:
			'Replace the text with a clear introduction about the student\'s project, methods, and goals. Include public links later if you want the profile to support outreach and recruitment.',
	},
	{
		slug: 'honours-student',
		name: 'Honours Student',
		role: 'Honours Student',
		category: 'honours',
		initials: 'HS',
		researchInterest:
			'text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text',
		bio:
			'Replace this text with a polished summary that explains the project question, methods being learned, and the student\'s developing interests in computational biomedicine.',
	},
	{
		slug: 'masters-student-01',
		name: 'Masters Student 01',
		role: 'Masters Student',
		category: 'masters',
		initials: 'M1',
		researchInterest:
			'text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text',
		bio:
			'It can cover topics such as predictive modelling, multi-omics integration, or computational support for translational studies. Update the card later with the student\'s name, portrait, and any associated project repository.',
	},
	{
		slug: 'masters-student-02',
		name: 'Masters Student 02',
		role: 'Masters Student',
		category: 'masters',
		initials: 'M2',
		researchInterest:
			'text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text',
		bio:
			'Use this space to describe the topic, the computational or statistical tools involved, and the connection to precision medicine or therapeutic discovery.',
	},
	{
		slug: 'masters-student-03',
		name: 'Masters Student 03',
		role: 'Masters Student',
		category: 'masters',
		initials: 'M3',
		researchInterest:
			'text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text',
		bio:
			'Replace this with a concise research summary and add the student\'s public links when available.',
	},
];

export const teamStats = [
	{ label: 'Postdoctoral Researchers', value: '1' },
	{ label: 'PhD Students', value: '8' },
	{ label: 'Masters Students', value: '3' },
	{ label: 'Honours Students', value: '1' },
];

export const categoryOrder: MemberCategory[] = ['postdoc', 'phd', 'masters', 'honours'];

export function hasPublicLinks(member: Member) {
	return Boolean(member.github || member.linkedin || member.email || member.links?.length);
}
