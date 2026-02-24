import { FaEnvelope, FaLinkedin } from 'react-icons/fa'
import './App.css'

function App() {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'resume', label: 'Resume' },
    { id: 'contact', label: 'Contact' },
  ]

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo" onClick={() => scrollToSection('home')}>
            Portfolio
          </div>
          <div className="nav-right">
            <ul className="nav-links">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection(item.id)
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <div className="content-wrapper">
        <section id="home" className="section">
          <div className="section-content">
            <h1 className="main-title">Ahmed Ali</h1>
            <p className="summary-statement">
              Software Developer with over 5 years of diverse experience in customer service, retail, and logistics. 
              Proficient in Java (specialty), JavaScript, HTML, CSS, and PHP. Hands-on experience in Artificial Intelligence 
              including training and creating chatbots. Skilled in multimedia production: video editing, photo editing, 
              short movie production, and game development using Unity and Unreal Engine. Always learning, always building.
            </p>
          </div>
        </section>

        <section id="education" className="section">
          <div className="section-content">
            <h2 className="section-title">Education</h2>
            <div className="education-item">
              <h3>Computer Systems Technology - Software Development</h3>
              <p className="institution">Mohawk College - Hamilton, ON, CA</p>
              <p className="date">September 2022 - April 2026</p>
              <p className="description">
                Comprehensive program focused on software development, programming languages, and modern development practices.
              </p>
            </div>
          </div>
        </section>

        <section id="skills" className="section">
          <div className="section-content">
            <h2 className="section-title">Skills</h2>
            <div className="skills-grid">
              <div className="skill-category">
                <h3>Programming Languages</h3>
                <div className="skill-tags">
                  <span className="skill-tag">Java</span>
                  <span className="skill-tag">JavaScript</span>
                  <span className="skill-tag">PHP</span>
                  <span className="skill-tag">HTML/CSS</span>
                </div>
              </div>
              <div className="skill-category">
                <h3>Game Development</h3>
                <div className="skill-tags">
                  <span className="skill-tag">Unity</span>
                  <span className="skill-tag">Unreal Engine</span>
                  <span className="skill-tag">C#</span>
                </div>
              </div>
              <div className="skill-category">
                <h3>AI & Multimedia</h3>
                <div className="skill-tags">
                  <span className="skill-tag">Artificial Intelligence</span>
                  <span className="skill-tag">Chatbots</span>
                  <span className="skill-tag">Video Editing</span>
                  <span className="skill-tag">Photo Editing</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="section">
          <div className="section-content">
            <h2 className="section-title">Projects</h2>
            <div className="project-showcase">
              <p className="project-description">Projects are being updated.</p>
            </div>
          </div>
        </section>

        <section id="resume" className="section">
          <div className="section-content">
            <h2 className="section-title">Resume</h2>
            <div className="resume-container">
              <p className="resume-description">
                Download my resume to view my complete work history, achievements, and detailed 
                experience in software engineering.
              </p>
              <a href={import.meta.env.BASE_URL + 'resume2025.docx'} className="resume-button" download>
                Download Resume (DOCX)
              </a>

              <div className="resume-preview">
                <h3>Experience Highlights</h3>
                <div className="experience-item">
                  <h4>Donation Processor</h4>
                  <p className="company">Mission Thrift Store - Hamilton, ON</p>
                  <p className="period">April 2025 - August 2025</p>
                  <ul>
                    <li>Handled and organized incoming donations, ensuring accurate sorting and placement</li>
                    <li>Managed high volumes of inventory in a fast-paced back-room environment</li>
                    <li>Collaborated with team members to maintain efficient store operations</li>
                    <li>Strengthened organizational skills and attention to detail</li>
                  </ul>
                </div>
                <div className="experience-item">
                  <h4>Key Holder</h4>
                  <p className="company">Lazer Mania - Hamilton, ON</p>
                  <p className="period">February 2022 - April 2024</p>
                  <ul>
                    <li>Repaired arcade machines addressing token blockages and ticket errors</li>
                    <li>Instructed customers on laser tag rules and equipment usage, enhancing their overall experience</li>
                    <li>Assisted with prize redemption and hosted birthday parties to ensure full customer satisfaction</li>
                  </ul>
                </div>
                <div className="experience-item">
                  <h4>Package Sorter</h4>
                  <p className="company">Canada Post - Hamilton, ON</p>
                  <p className="period">November 2023 - January 2024</p>
                  <ul>
                    <li>Sorted an average of 600 mail and package items per hour, consistently meeting productivity standards</li>
                    <li>Maintained a 99% accuracy rate in sorting, ensuring reliable and error-free delivery</li>
                    <li>Collaborated with team members to process over 5,000 items daily in a fast-paced environment</li>
                  </ul>
                </div>
                <div className="experience-item">
                  <h4>Cashier</h4>
                  <p className="company">Food Basic Metro Inc - Hamilton, ON</p>
                  <p className="period">December 2021 - March 2022</p>
                  <ul>
                    <li>Memorized produce item SKUs to streamline checkout processes</li>
                    <li>Provided comprehensive assistance to customers, addressing concerns and special needs</li>
                    <li>Reduced checkout time by 15% and improved customer satisfaction ratings by 10% through efficient service</li>
                  </ul>
                </div>
                <div className="experience-item">
                  <h4>Team Member</h4>
                  <p className="company">McDonald's Corporation - Hamilton, ON</p>
                  <p className="period">November 2018 December - 2021</p>
                  <ul>
                    <li>Memorized menu items and processed daily sales, contributing to a $2000 daily revenue</li>
                    <li>Delivered prompt and friendly customer service while maintaining inventory and cleanliness</li>
                    <li>Enhanced overall customer satisfaction and teamwork, reflected in improved survey scores</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="section-content">
            <h2 className="section-title">Contact Information</h2>
            <div className="contact-container">
              <div className="contact-info">
                <div className="contact-item">
                  <h3><FaEnvelope className="contact-icon" /> Email</h3>
                  <a href="mailto:Ahmedali.mohamed7597@gmail.com">Ahmedali.mohamed7597@gmail.com</a>
                </div>
                <div className="contact-item">
                  <h3><FaLinkedin className="contact-icon" /> LinkedIn</h3>
                  <a href="https://www.linkedin.com/in/ahmed-ali-229b89229/" target="_blank" rel="noopener noreferrer">Ahmed Ali</a>
                </div>
                <div className="contact-item">
                  <h3>Location</h3>
                  <p>Canada</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
