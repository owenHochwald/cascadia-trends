import { FaGithub, FaLinkedin } from 'react-icons/fa';

const AboutCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">{title}</h2>
        <div className="text-gray-300 space-y-4">
            {children}
        </div>
    </div>
);

const About = () => {
    return (
        <div className="min-h-screen bg-gray-950 px-4 py-4 lg:px-6 lg:py-6">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">About This Project</h1>
                    <p className="text-gray-400">Exploring Housing Market Trends Through Data Visualization</p>
                </header>

                <div className="grid gap-6">
                    <AboutCard title="Project Overview">
                        <p>
                            This project aims to provide comprehensive insights into housing market trends
                            through interactive data visualizations. By analyzing various metrics such as
                            price distributions, property sizes, and temporal patterns, we offer a deep
                            understanding of market dynamics.
                        </p>
                    </AboutCard>

                    <AboutCard title="Features">
                        <ul className="list-disc list-inside space-y-2">
                            <li>Interactive data filtering and visualization</li>
                            <li>Real-time price trend analysis</li>
                            <li>Property size distribution insights</li>
                            <li>Bedroom category analysis</li>
                            <li>Comprehensive market statistics</li>
                        </ul>
                    </AboutCard>

                    <AboutCard title="Technology Stack">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold mb-2">Frontend</h3>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>React</li>
                                    <li>TypeScript</li>
                                    <li>Redux Toolkit</li>
                                    <li>Recharts</li>
                                    <li>Tailwind CSS</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Backend</h3>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>FastAPI</li>
                                    <li>Python</li>
                                    <li>Pandas</li>
                                    <li>NumPy</li>
                                    <li>Docker</li>
                                </ul>
                            </div>
                        </div>
                    </AboutCard>

                    <AboutCard title="Data Sources">
                        <p>
                            The data used in this project comes from [Your Data Source Here]. It includes
                            comprehensive information about residential properties, including prices,
                            square footage, number of bedrooms, and other relevant metrics.
                        </p>
                    </AboutCard>

                    <AboutCard title="Connect">
                        <div className="flex space-x-4">
                            <a
                                href="https://github.com/yourusername"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                            >
                                <FaGithub size={24} />
                                <span>GitHub</span>
                            </a>
                            <a
                                href="https://linkedin.com/in/yourusername"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                            >
                                <FaLinkedin size={24} />
                                <span>LinkedIn</span>
                            </a>
                        </div>
                    </AboutCard>
                </div>

                <footer className="mt-12 text-center text-gray-500">
                    <p>© 2024 Housing Market Analytics. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default About;