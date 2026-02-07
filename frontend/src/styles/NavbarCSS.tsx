const NavbarCSS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

    .nav-sidebar {
      height: 100vh;
      width: 280px;
      background: linear-gradient(135deg, #22c1c3 0%, #2d86fd 100%);
      color: white;
      position: fixed;
      top: 0;
      left: 0;
      padding: 25px 20px;
      box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      z-index: 1000;
      overflow-y: auto;
    }

    .nav-sidebar::-webkit-scrollbar {
      width: 6px;
    }

    .nav-sidebar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 3px;
    }

    .nav-header {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid rgba(255, 255, 255, 0.2);
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: white;
      transition: opacity 0.2s ease;
    }

    .nav-brand:hover {
      opacity: 0.9;
    }

    .nav-logo {
      width: 40px;
      height: 40px;
      object-fit: contain;
    }

    .nav-brand-text {
      font-family: 'Press Start 2P', cursive;
      font-size: 0.9rem;
      line-height: 1.5;
      color: white;
    }

    .nav-profile-section {
      margin-bottom: 25px;
    }

    .nav-menu {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
    }

    .nav-item {
      margin: 0;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      color: white;
      text-decoration: none;
      border-radius: 10px;
      transition: all 0.2s ease;
      cursor: pointer;
      background: transparent;
      border: 2px solid transparent;
      width: 100%;
      text-align: left;
      font-family: 'Press Start 2P', cursive;
      font-size: 0.65rem;
      line-height: 1.5;
    }

    .nav-link:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateX(4px);
    }

    .nav-link.active {
      background: rgba(255, 255, 255, 0.25);
      border-color: white;
    }

    .nav-link-icon {
      flex-shrink: 0;
    }

    .nav-link-text {
      white-space: nowrap;
    }

    .nav-logout {
      margin-top: auto;
      padding-top: 20px;
      border-top: 2px solid rgba(255, 255, 255, 0.2);
    }

    .nav-logout .nav-link {
      background: rgba(220, 53, 69, 0.2);
    }

    .nav-logout .nav-link:hover {
      background: rgba(220, 53, 69, 0.4);
      transform: translateX(4px);
    }

    /* Hide mobile teacher button on desktop */
    .nav-teacher-mobile {
      display: none;
    }

    @media (max-width: 768px) {
      .nav-sidebar {
        width: 100%;
        height: 70px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0 15px;
        overflow-y: visible;
        overflow-x: auto;
      }

      .nav-sidebar::-webkit-scrollbar {
        height: 0;
      }

      .nav-header {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }

      .nav-logo {
        width: 35px;
        height: 35px;
      }

      .nav-brand-text {
        font-size: 0.7rem;
      }

      .nav-profile-section {
        display: none;
      }

      .nav-menu {
        flex-direction: row;
        gap: 6px;
        flex: 0;
        white-space: nowrap;
      }

      .nav-link {
        padding: 10px 12px;
        font-size: 0.6rem;
        border-radius: 8px;
        min-width: auto;
      }

      .nav-link:hover {
        transform: translateY(-2px);
      }

      .nav-link-text {
        display: none;
      }

      .nav-logout {
        margin-top: 0;
        padding-top: 0;
        border-top: none;
        margin-left: 6px;
      }

      /* Show mobile teacher button */
      .nav-teacher-mobile {
        display: block;
      }
    }

    @media (max-width: 480px) {
      .nav-brand-text {
        display: none;
      }

      .nav-logo {
        width: 32px;
        height: 32px;
      }

      .nav-link {
        padding: 8px 10px;
      }
    }
  `}</style>
);

export default NavbarCSS;