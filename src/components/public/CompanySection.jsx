'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

export default function CompanySection() {
  const [vis, setVis] = useState(false);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const chatgptRef = useRef(null);
  const aetherRef = useRef(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVis(true);
        obs.disconnect();
      }
    }, { threshold: 0.1 });

    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (vis) {
      const tl = gsap.timeline();

      // Title animation
      tl.fromTo(titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      )

      // ChatGPT vs AetherSolve comparison animation
      .fromTo(chatgptRef.current,
        { opacity: 0, x: -50, scale: 0.9 },
        { opacity: 1, x: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.4"
      )
      .fromTo(aetherRef.current,
        { opacity: 0, x: 50, scale: 0.9 },
        { opacity: 1, x: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.4"
      )

      // Description text animation
      .fromTo(descriptionRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out"
        },
        "-=0.2"
      );
    }
  }, [vis]);

  return (
    <section
      ref={sectionRef}
      className="company-section"
      style={{
        padding: '80px 0',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '48px'
      }}>
        {/* Title */}
        <h2
          ref={titleRef}
          className="text-display company-title"
          style={{
            color: 'var(--text)',
            textAlign: 'center',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '700',
            lineHeight: '1.2',
            marginBottom: '16px'
          }}
        >
          Why <span style={{ color: 'var(--accent)' }}>AetherSolve</span>, not AI Model?
        </h2>

        {/* Comparison Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px',
          width: '100%',
          maxWidth: '800px'
        }}>
          {/* ChatGPT vs AetherSolve Cards */}
          <div
            className="comparison-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              width: '100%'
            }}
          >
            {/* AI Model Card */}
            <div
              ref={chatgptRef}
              className="comparison-card"
              style={{
                background: 'var(--surface-2)',
                border: '2px solid var(--border)',
                borderRadius: '16px',
                padding: '32px 24px',
                textAlign: 'center',
                position: 'relative',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                background: 'var(--surface-1)',
                border: '1.5px solid var(--border)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white'
              }}>
                AI
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: 'var(--text)',
                marginBottom: '12px'
              }}>
                AI Model
              </h3>
              <p style={{
                color: 'var(--text-3)',
                fontSize: '0.95rem',
                lineHeight: '1.5'
              }}>
                Answers questions
              </p>
            </div>

            {/* AetherSolve Card */}
            <div
              ref={aetherRef}
              className="comparison-card"
              style={{
                background: 'linear-gradient(rgba(255,92,26,0.05), rgba(255,92,26,0.1))',
                border: '2px solid var(--accent)',
                borderRadius: '16px',
                padding: '32px 24px',
                textAlign: 'center',
                position: 'relative',
                boxShadow: '0 4px 20px rgba(255,92,26,0.15)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Image
                  src="/newaether.png"
                  alt="AetherSolve Logo"
                  width={60}
                  height={60}
                  style={{
                    objectFit: 'contain'
                  }}
                />
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: 'var(--text)',
                marginBottom: '12px'
              }}>
                AetherSolve
              </h3>
              <p style={{
                color: 'var(--text-3)',
                fontSize: '0.95rem',
                lineHeight: '1.5'
              }}>
                Automates workflows
              </p>
            </div>
          </div>

          <div
            ref={descriptionRef}
            className="company-description"
            style={{
              textAlign: 'center',
              maxWidth: '700px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
              lineHeight: '1.6',
              color: 'var(--text-2)',
              fontWeight: '500'
            }}>
              Any business can sign up for an AI tool. But connecting it to your Tally data, your Excel sheets, your WhatsApp groups, your team's actual process — that requires someone who sits with you, understands your operations, and builds something that runs without you touching it.
            </p>
                <p style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
                lineHeight: '1.6',
                color: 'var(--text-2)',
                fontWeight: '500'
            }}>
              That's what we do. For businesses in Tier 2 India that can't afford a full tech team but are losing real money to manual processes every day.
            </p>

            <div className='innertext' style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
                lineHeight: '1.6',
                color: 'var(--text-2)',
                fontWeight: '500',
                fontStyle: 'italic',
                marginTop: '8px',
                borderLeft: '4px solid var(--accent)',
                paddingLeft: '16px',
                maxWidth: '600px',
                margin: '16px auto 0'
            }}>
                <p style={{
                    color: 'var(--accent)',
                    fontWeight: '600',
                    fontStyle: 'italic'
                }}>
                    <em>"AetherSolve —

                    AI automation for Indian businesses that run on Excel, WhatsApp, and manual processes."</em>
                </p>
            </div>
          </div>
        </div>
      </div>

     
    </section>
  );
}  



