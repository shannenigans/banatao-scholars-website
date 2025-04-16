import { Story } from "@/components/story-carousel";

type Testimonial = {
    id: string,
    name: string,
    tag: string
    short: string,
    long?: string
}

export const testimonials: Testimonial[] =
[
    {
        id: 'maria_santos',
        name: 'Maria Santos',
        tag: "Computer Science, Stanford '19",
        short: "The Banatao Scholarship allowed me to focus on my studies without the burden of financial stress. I'm now working at a leading tech company building the future of AI."
    },
    {
        id: 'james_rodriguez',
        name: 'James Rodriguez',
        tag: "Bioengineering, UC Berkeley '20",
        short: "Being part of the Banatao Scholars community connected me with mentors who guided me through my academic journey and helped launch my career in biotech."
    },
    {
        id: 'anna_reyes',
        name: 'Anna Reyes',
        tag: "Electrical Engineering, MIT '21",
        short: "The scholarship not only supported me financially but also introduced me to a network of brilliant Filipino Americans in tech that I continue to collaborate with today."
    },
];

export const stories: Story[] = [
    {
        id: 'carter_cote',
        slug: 'carter_cote',
        title: 'Carter Cote',
        excerpt: "Carter Cote is a Filipino-American software engineer and designer currently pursuing his Master's in HCI at Stanford, where he studies how human feedback and preferences can drive the future of human-AI interaction. Carter's journey in software began at age 12 when he designed video game assets and created YouTube videos about his work—efforts that eventually led to over 4 million downloads. This hobby ignited a deeper passion for using design to make a positive impact through web apps, and he soon became curious about building the software behind websites, not just designing them.\n\rAt 19, Carter developed a career pathway exploration platform for high school students in an effort to close the information gap around discovering and pursuing careers. However, after recognizing the challenges of scaling the idea, he decided to discontinue further development and explore other opportunities.\n\rIn college, Carter worked on consumer software products that collectively reached over 5 million users, including a generative-AI music platform, a generative-AI content platform, and a mobile app that enables users to sell items online from just an image. During this time, he also dedicated efforts to building communities that empower like-minded peers. This led to the creation of Startup Exchange—a nonprofit that enables college students to learn how to build side projects and transform them into startups. Since Fall 2022, over 10,000 students from more than 40 universities have attended Startup Exchange events, and the organization has raised over $100,000 from companies such as Google, Nvidia, and Meta.\n\rToday, Carter is finishing his degree while working on a startup called Phia, which aims to reimagine how people shop online. His long-term goal is to reimagine how software enables self-improvement and consumer habits."
    },
    {
        id: 'airyl_van_dayrit',
        slug: 'airyl_van_dayrit',
        title: 'Airyl van Dayrit',
        excerpt: 'Now a senior, graduating in two months, I look back, and can confidently say that I lived a life worthy of giving it up. Not by taking it, but giving it up to the harsh realities that often consume immigrants: a life cycle filled with minimum-wage jobs, drugs, and addiction. Like any life, mine is filled with uncertainty and disappointments, but I am proud to have set myself apart, shaping it with achievements; through positivity, perseverance, and persistence.\n I was never meant to go to college. My destiny was preordained to either enlist in the navy, go back to the Philippines, or work a minimum wage job of which all succumbed to the demoralizing reality of living paycheck-to-paycheck. However, I have challenged that fate by working hard to pursue opportunities that open doors to an alternate path. I have competed in every way I could, gaining life experience, earning rewards, and uncovering a new possibility—having my college education funded through a scholarship, finally discovering a way out of misery. With this newfound opportunity, I refused to have let my circumstances define me. Instead, I sought a place where I could thrive, contribute, and continue to grow. That place was the University of Colorado Boulder, an institution I knew I could make a meaningful impact, whether through my diversified intellect or my cultural perspective.\n During my first months in Boulder, everything felt very welcoming—the people, the classes, and the environment. Everything and everyone was great, yet I never truly felt like I belonged. The confidence I had built in high school slowly faded. It got replaced by an overwhelming insecurity about my past and where I came from. It all felt too good, almost unreal, as if it wasn’t meant for me. I never fully understood why insecurity consumed me, but thankfully, I found a way to overcome it.\n After rediscovering myself and my inspiration, for the rest of my first year, I refused to lose momentum. Fueled by newfound confidence, I pursued every opportunity that came my way. I declared a minor early on, stepping into a class filled with seniors as the only freshman, slowly proving my worth through participation and engagement. I gained hands-on research experience as a lab assistant, immersing myself in the world of micro-fabrication and characterization. In my free time, I also found a community—one that embraced me—and I learned to lead within it, becoming an intern and representing the broader Asian population while celebrating and advocating for its rich culture and diversity. Next thing I knew, the summer came, and  I realized how much I had grown in just one year, feeling more ready than ever to take on whatever came next.\n Little did I know that the rigor of college would actually disrupt the momentum I had built. In the fall of my sophomore year, I struggled for the first time to grasp the content of my classes. Calculus 3 just wasn’t clicking, and the frustration was unlike anything I had experienced before. But in the midst of that struggle, I found solace in the connections I had made during the Banatao retreat, reminding myself that I wasn’t alone. I reached out to my peers and sought advice from my mentors. Little by little, the struggle didn’t feel as overwhelming anymore. With their guidance and support, I found the inspiration to keep pushing forward, and soon, I was able to manage.\n The next thing I knew, I was studying abroad. After managing my toughest classes, I took another leap and traveled to South Korea to attend Korea University, the third most prestigious institution in the country. It turned out to be one of the best experiences of my life. Not only were my classes easier to grasp, due to their focus on concept learning than problem solving, but I was also able to meet People with whom I formed some of my deepest connections with.\n Now, As a senior, I wanted to make the most out of my last year. I was on campus 12 hours every day, from morning to night, running from meeting to meeting trying my best to leave an impact. I became the President of Asian Unity, leading 250 people to advocate for their identity. I co-founded a new consulting firm, already sourcing $30k from well-known clients. I am project managing my capstone project, building an autonomous rover that will detect methane levels on a landfill in Southern California. I am teaching two high school classes about the importance of air quality. I am assisting a lab in making a teaching aid to teach a course about Building System Controls and Technologies. While finding time to also be a peer advisor and mentor for the underclassmen of my department. I am proud to say that I do this to prove that the opportunity I was given to attend college was truly worth it. \n So this is my story, and I owe it to the chance this scholarship has given me. Without it, I would have never been in a position to learn and pursue these opportunities. The experiences and achievements I’ve gained in college would not have come to fruition without this support. \n Thanks to the financial assistance, I had a safety net that gave me the time and confidence to focus on opportunities rather than constantly worrying about money—opportunities that many others take for granted. It allowed me to stand on equal footing with my peers, providing not just financial security but also the communal and professional support of the Banatao family and foundation. It was a boost like no other—one that empowered me to learn, grow, and proudly represent Filipino excellence. \n Their unwavering support allowed me to focus on thriving rather than simply surviving. Because of the Banatao family and their profound influence, I proved that my life was never meant to be given up; it was meant to be lived fully, with purpose and pride. For that, I will always and forever be more than grateful.'
    },
]
