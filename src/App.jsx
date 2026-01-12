// Portfolio website with a 3D model that follows your cursor
// Pretty neat, right? Got all my info, projects, and stuff laid out nicely

import { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, useGLTF } from '@react-three/drei'
import { FaEnvelope, FaLinkedin } from 'react-icons/fa'
import './App.css'

// The 3D model path - using Vite's base URL so it works in dev and production
const MODEL_PATH = import.meta.env.BASE_URL + 'mystery.gltf'

// Preload the model so it's ready when we need it
useGLTF.preload(MODEL_PATH)

// 3D model component that rotates based on mouse position
// When you hover the center it spins, otherwise it follows your cursor
function RotatingModel({ mousePosition, isHovering }) {
  const { scene } = useGLTF(MODEL_PATH)
  const meshRef = useRef()
  
  // Set up materials when model loads - making sure it's white and visible
  // Had issues with it being invisible before, this fixes that
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          if (child.material) {
            // Handle both single materials and arrays (some models are weird like that)
            const materials = Array.isArray(child.material) ? child.material : [child.material]
            
            materials.forEach(mat => {
              if (mat) {
                // Force update so it renders properly
                mat.needsUpdate = true
                
                // Make sure it's not transparent
                if (mat.transparent !== undefined) {
                  mat.transparent = false
                }
                if (mat.opacity !== undefined) {
                  mat.opacity = 1
                }
                
                // Pure white color for the model
                if (mat.color) {
                  mat.color.setRGB(1, 1, 1)
                }
              }
            })
          }
        }
      })
    }
  }, [scene])
  
  // Animation loop - handles rotation based on cursor or hover
  useFrame((state, delta) => {
    if (meshRef.current) {
      if (isHovering) {
        // Spin it fast when hovering!
        meshRef.current.rotation.y += delta * 2
      } else {
        // Normal cursor following with smooth interpolation
        const rotationY = mousePosition.x * Math.PI * 0.3
        const rotationX = -mousePosition.y * Math.PI * 0.3
        
        // Smooth it out so it doesn't look janky
        meshRef.current.rotation.y += (rotationY - meshRef.current.rotation.y) * 0.1
        meshRef.current.rotation.x += (rotationX - meshRef.current.rotation.x) * 0.1
      }
    }
  })

  return (
    <primitive 
      ref={meshRef}
      object={scene} 
      scale={1.5} 
      position={[0, 0, 0]}
    />
  )
}

// Main app component - handles everything: 3D model, navigation, hover effects, portfolio sections
function App() {
  // State for tracking mouse and hover stuff
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHoveringCenter, setIsHoveringCenter] = useState(false)
  const [hoverProgress, setHoverProgress] = useState(0)
  const [showAnnouncement, setShowAnnouncement] = useState(false)
  const [modelVisible, setModelVisible] = useState(false)
  
  // Config and refs for timers
  const hoverEffectEnabled = modelVisible
  const hoverTimerRef = useRef(null)
  const progressIntervalRef = useRef(null)
  const HOVER_DURATION = 4000

  // Helper to clean up timers
  const cleanupTimers = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }
  }

  // Helper to reset hover state
  const resetHoverState = () => {
    setIsHoveringCenter(false)
    setHoverProgress(0)
    setShowAnnouncement(false)
  }

  // Handle mouse movement - tracks cursor and checks if near center for hover effect
  const handleMouseMove = (e) => {
    // Convert mouse position to -1 to 1 range for the 3D rotation
    const x = (e.clientX / window.innerWidth) * 2 - 1
    const y = -(e.clientY / window.innerHeight) * 2 + 1
    setMousePosition({ x, y })
    
    // Figure out if we're near the center of the screen
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    const distanceX = Math.abs(e.clientX - centerX)
    const distanceY = Math.abs(e.clientY - centerY)
    
    // 15% of screen size seems like a good threshold
    const threshold = Math.min(window.innerWidth, window.innerHeight) * 0.15
    
    const isNearCenter = distanceX < threshold && distanceY < threshold
    
    // Start the hover effect if we're near center and it's enabled
    if (isNearCenter && !isHoveringCenter && hoverEffectEnabled) {
      setIsHoveringCenter(true)
      setHoverProgress(0)
      setShowAnnouncement(true)
      
      // Progress animation setup
      const intervalDuration = 50 // Update every 50ms for smooth animation
      const progressIncrement = 100 / (HOVER_DURATION / intervalDuration)
      
      // Animate the progress ring
      progressIntervalRef.current = setInterval(() => {
        setHoverProgress(prev => {
          const newProgress = prev + progressIncrement
          if (newProgress >= 100) {
            clearInterval(progressIntervalRef.current)
            return 100
          }
          return newProgress
        })
      }, intervalDuration)
      
      // After the duration, open the game project page
      hoverTimerRef.current = setTimeout(() => {
        window.open('https://www.notion.so/ParadoxofPerfection-6b7d0ca8a3984281983b9f76e26353f6', '_blank')
        resetHoverState()
      }, HOVER_DURATION)
    } 
    // Stop if we moved away or the effect is disabled
    else if ((!isNearCenter && isHoveringCenter) || !hoverEffectEnabled) {
      resetHoverState()
      cleanupTimers()
    }
  }
  
  // Stop hover effect when model is hidden
  useEffect(() => {
    if (!hoverEffectEnabled && isHoveringCenter) {
      resetHoverState()
      cleanupTimers()
    }
  }, [hoverEffectEnabled, isHoveringCenter])

  // Cleanup timers on unmount
  useEffect(() => {
    return cleanupTimers
  }, [])

  // Smooth scroll to a section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="app-container" onMouseMove={handleMouseMove}>
      {/* 3D Model Background - the star of the show! */}
      <div className="canvas-container">
        {modelVisible && (
          <Canvas style={{ width: '100%', height: '100%' }}>
            {/* Camera setup */}
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            
            {/* Lots of lights to make sure the model looks good from all angles */}
            <ambientLight intensity={1.5} color="#ffffff" />
            <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
            <pointLight position={[-10, -10, -10]} intensity={1.5} color="#ffffff" />
            <pointLight position={[0, 10, 0]} intensity={2} color="#ffffff" />
            <pointLight position={[0, -10, 0]} intensity={1.5} color="#ffffff" />
            <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
            <directionalLight position={[-5, -5, -5]} intensity={1.5} color="#ffffff" />
            
            {/* The actual 3D model */}
            <RotatingModel mousePosition={mousePosition} isHovering={isHoveringCenter} />
          </Canvas>
        )}
      </div>

      {/* Progress ring that shows when hovering center */}
      {isHoveringCenter && (
        <div className="center-hover-indicator">
          <div className="hover-progress-ring">
            <svg className="progress-svg" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                className="progress-circle"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="4"
              />
              {/* The animated progress circle */}
              <circle
                className="progress-circle-fill"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255, 255, 255, 0.9)"
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - hoverProgress / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Announcement that shows when hovering */}
      <div className={`announcement ${showAnnouncement ? 'show' : ''}`}>
        <div className="announcement-content">
          <div className="announcement-icon">🎮</div>
          <div className="announcement-text">
            <h3>Taking you to Game Project</h3>
            <p>Hold your cursor here to visit my game project page</p>
          </div>
        </div>
      </div>

      {/* Navigation bar at the top */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo" onClick={() => scrollToSection('home')}>
            Portfolio
          </div>
          <div className="nav-right">
            {/* Hint text pointing to the model toggle */}
            <span className="hint-text">click for a surprise👉</span>
            
            {/* Toggle button to show/hide the model */}
            <button 
              className="model-toggle"
              onClick={() => {
                setModelVisible(!modelVisible)
                if (modelVisible) {
                  resetHoverState()
                  cleanupTimers()
                }
              }}
              title={modelVisible ? "Hide The Eye" : "Show The Eye"}
              aria-label={modelVisible ? "Hide The Eye" : "Show The Eye"}
            >
              {modelVisible ? "👁️" : "👁️‍🗨️"}
            </button>
            
            {/* Navigation links */}
            <ul className="nav-links">
              <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home') }}>Home</a></li>
              <li><a href="#education" onClick={(e) => { e.preventDefault(); scrollToSection('education') }}>Education</a></li>
              <li><a href="#skills" onClick={(e) => { e.preventDefault(); scrollToSection('skills') }}>Skills</a></li>
              <li><a href="#projects" onClick={(e) => { e.preventDefault(); scrollToSection('projects') }}>Projects</a></li>
              <li><a href="#resume" onClick={(e) => { e.preventDefault(); scrollToSection('resume') }}>Resume</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact') }}>Contact</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* All the main content sections */}
      <div className="content-wrapper">
        {/* Home section with my intro */}
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

        {/* Education section */}
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

        {/* Skills section */}
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

        {/* Projects section - featuring my game project */}
        <section id="projects" className="section">
          <div className="section-content">
            <h2 className="section-title">Projects</h2>
            <div className="project-showcase">
              {/* Clickable project card */}
              <div 
                className="project-card"
                onClick={() => window.open('https://www.notion.so/ParadoxofPerfection-6b7d0ca8a3984281983b9f76e26353f6', '_blank')}
                role="button"
                tabIndex={0}
                aria-label="Open Paradox of Perfection game project"
                onKeyDown={(e) => {
                  // Keyboard support for accessibility
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    window.open('https://www.notion.so/ParadoxofPerfection-6b7d0ca8a3984281983b9f76e26353f6', '_blank')
                  }
                }}
              >
                <h3>Paradox of Perfection - Game Project</h3>
                <p className="project-description">
                  An immersive game project exploring themes of perfection and paradox. 
                  Built with modern game development technologies and featuring engaging gameplay mechanics.
                </p>
                <div className="project-tech">
                  <span>Game Development</span>
                  <span>Unity</span>
                  <span>C#</span>
                </div>
              </div>
              
              {/* YouTube video embed */}
              <div className="youtube-player">
                <iframe
                  width="100%"
                  height="315"
                  src="https://www.youtube.com/embed/fgrpeV9Js3Y"
                  title="Paradox of Perfection Game Showcase"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <p className="video-description">
                  This is a game demo based on a real game I am developing. This game demo was made by me and Souvanno Souvannasane. It's not a representative of the final game.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Resume section with download and highlights */}
        <section id="resume" className="section">
          <div className="section-content">
            <h2 className="section-title">Resume</h2>
            <div className="resume-container">
              <p className="resume-description">
                Download my resume to view my complete work history, achievements, and detailed 
                experience in software engineering.
              </p>
              {/* Resume download link */}
              <a href={import.meta.env.BASE_URL + 'resume2025.docx'} className="resume-button" download>
                Download Resume (DOCX)
              </a>
              
              {/* Work experience highlights */}
              <div className="resume-preview">
                <h3>Experience Highlights</h3>
                
                {/* Donation Processor */}
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
                
                {/* Key Holder */}
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
                
                {/* Package Sorter */}
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
                
                {/* Cashier */}
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
                
                {/* Team Member */}
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

        {/* Contact section */}
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
