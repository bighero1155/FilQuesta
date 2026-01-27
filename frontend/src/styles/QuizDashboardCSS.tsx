// src/styles/QuizDashboardCSS.tsx
import React from "react";

const QuizDashboardCSS: React.FC = () => {
  return (
    <style>{`
      /* Container */
      .quiz-dashboard-container {
        background-color: #f8f9fa;
        min-height: 100vh;
        padding: 1.5rem;
      }

      /* Header Section */
      .quiz-dashboard-header {
        margin-bottom: 1.5rem;
      }

      .quiz-dashboard-header-content {
        display: flex;
        justify-content: space-between;
        align-items: start;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .quiz-dashboard-title-section h1 {
        font-size: 1.75rem;
        margin-bottom: 0.5rem;
        color: #212529;
        font-weight: bold;
        display: flex;
        align-items: center;
      }

      .quiz-dashboard-icon {
        background: linear-gradient(135deg, #0d6efd, #0a58ca);
        color: white;
        border-radius: 0.75rem;
        padding: 0.5rem;
        font-size: 1.5rem;
        margin-right: 1rem;
      }

      .quiz-dashboard-subtitle {
        color: #6c757d;
        margin-bottom: 0;
        margin-left: 0.25rem;
      }

      .quiz-dashboard-create-btn {
        background: linear-gradient(135deg, #0d6efd, #0a58ca);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        font-size: 1.125rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .quiz-dashboard-create-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
      }

      .quiz-dashboard-create-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      /* Alerts */
      .quiz-dashboard-alert {
        border: none;
        border-radius: 12px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        margin-bottom: 1.5rem;
      }

      .quiz-dashboard-alert-success {
        background-color: #d1e7dd;
        color: #0f5132;
      }

      .quiz-dashboard-alert-danger {
        background-color: #f8d7da;
        color: #842029;
      }

      /* Stats Cards */
      .quiz-dashboard-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .quiz-dashboard-stat-card {
        background: white;
        border: none;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        padding: 1.5rem;
        transition: all 0.3s ease;
      }

      .quiz-dashboard-stat-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
      }

      .quiz-dashboard-stat-content {
        display: flex;
        align-items: center;
      }

      .quiz-dashboard-stat-icon {
        flex-shrink: 0;
        border-radius: 0.75rem;
        padding: 1rem;
        color: white;
      }

      .quiz-dashboard-stat-icon-primary {
        background: linear-gradient(135deg, #0d6efd, #0a58ca);
      }

      .quiz-dashboard-stat-icon-success {
        background: linear-gradient(135deg, #198754, #146c43);
      }

      .quiz-dashboard-stat-icon-info {
        background: linear-gradient(135deg, #0dcaf0, #0aa2c0);
      }

      .quiz-dashboard-stat-icon i {
        font-size: 1.5rem;
      }

      .quiz-dashboard-stat-details {
        flex-grow: 1;
        margin-left: 1rem;
      }

      .quiz-dashboard-stat-label {
        color: #6c757d;
        margin-bottom: 0.25rem;
        font-weight: normal;
        font-size: 0.95rem;
      }

      .quiz-dashboard-stat-value {
        margin-bottom: 0;
        font-weight: bold;
        font-size: 2rem;
        color: #212529;
      }

      /* Main Card */
      .quiz-dashboard-main-card {
        background: white;
        border: none;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }

      .quiz-dashboard-card-header {
        background: white;
        border: none;
        padding: 1.5rem;
      }

      .quiz-dashboard-card-title {
        margin-bottom: 0;
        font-weight: bold;
        color: #212529;
        display: flex;
        align-items: center;
        font-size: 1.25rem;
      }

      .quiz-dashboard-card-title i {
        margin-right: 0.5rem;
        color: #0d6efd;
        font-size: 1.25rem;
      }

      .quiz-dashboard-card-body {
        padding: 0;
      }

      /* Loading State */
      .quiz-dashboard-loading {
        text-align: center;
        padding: 3rem 0;
      }

      .quiz-dashboard-spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #0d6efd;
        border-radius: 50%;
        width: 3rem;
        height: 3rem;
        animation: quiz-dashboard-spin 1s linear infinite;
        margin: 0 auto 1rem;
      }

      @keyframes quiz-dashboard-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .quiz-dashboard-loading-text {
        color: #6c757d;
      }

      /* Empty State */
      .quiz-dashboard-empty {
        text-align: center;
        padding: 3rem 1.5rem;
      }

      .quiz-dashboard-empty-icon {
        margin-bottom: 1.5rem;
      }

      .quiz-dashboard-empty-icon i {
        font-size: 5rem;
        color: #0d6efd;
        opacity: 0.25;
      }

      .quiz-dashboard-empty-title {
        color: #212529;
        margin-bottom: 0.5rem;
        font-size: 1.5rem;
      }

      .quiz-dashboard-empty-text {
        color: #6c757d;
        margin-bottom: 1.5rem;
      }

      .quiz-dashboard-empty-btn {
        background: linear-gradient(135deg, #0d6efd, #0a58ca);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        font-size: 1.125rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .quiz-dashboard-empty-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
      }

      /* Table */
      .quiz-dashboard-table-wrapper {
        overflow-x: auto;
        position: relative;
      }

      .quiz-dashboard-table-wrapper::-webkit-scrollbar {
        height: 8px;
      }

      .quiz-dashboard-table-wrapper::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }

      .quiz-dashboard-table-wrapper::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 10px;
      }

      .quiz-dashboard-table-wrapper::-webkit-scrollbar-thumb:hover {
        background: #555;
      }

      /* Scroll indicator */
      .quiz-dashboard-table-wrapper::after {
        content: '← Swipe to see more →';
        position: sticky;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, transparent, #f8f9fa 20%, #f8f9fa);
        padding: 0.5rem 1rem;
        font-size: 0.75rem;
        color: #6c757d;
        pointer-events: none;
        display: none;
        text-align: right;
        font-style: italic;
      }

      @media (max-width: 768px) {
        .quiz-dashboard-table-wrapper::after {
          display: block;
        }
      }

      .quiz-dashboard-table {
        width: 100%;
        margin-bottom: 0;
      }

      .quiz-dashboard-table thead {
        background-color: #f8f9fa;
      }

      .quiz-dashboard-table th {
        border: none;
        padding: 1rem 1.5rem;
        color: #6c757d;
        font-weight: 600;
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        white-space: nowrap;
      }

      .quiz-dashboard-table td {
        padding: 1.5rem;
        border-bottom: 1px solid #f0f0f0;
        vertical-align: middle;
        white-space: normal;
      }

      .quiz-dashboard-table td:first-child,
      .quiz-dashboard-table td:nth-child(2) {
        min-width: 150px;
      }

      .quiz-dashboard-table td:nth-child(3) {
        min-width: 100px;
        text-align: center;
      }

      .quiz-dashboard-table td:nth-child(4) {
        min-width: 280px;
      }

      .quiz-dashboard-table tbody tr {
        transition: background-color 0.2s ease;
      }

      .quiz-dashboard-table tbody tr:hover {
        background-color: #f8f9fa;
      }

      .quiz-dashboard-table tbody tr:last-child td {
        border-bottom: none;
      }

      .quiz-dashboard-quiz-title {
        font-weight: 600;
        color: #212529;
      }

      .quiz-dashboard-quiz-description {
        color: #6c757d;
      }

      .quiz-dashboard-question-badge {
        background: linear-gradient(135deg, #0d6efd, #0a58ca);
        color: white;
        border-radius: 50px;
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        display: inline-block;
      }

      /* Action Buttons */
      .quiz-dashboard-actions {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        flex-wrap: wrap;
        min-width: 280px;
      }

      .quiz-dashboard-action-btn {
        border: 2px solid;
        background: transparent;
        padding: 0.5rem 0.85rem;
        border-radius: 0.75rem;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 1.1rem;
        flex-shrink: 0;
      }

      .quiz-dashboard-action-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .quiz-dashboard-action-btn-info {
        border-color: #0dcaf0;
        color: #0dcaf0;
      }

      .quiz-dashboard-action-btn-info:hover {
        background-color: #0dcaf0;
        color: white;
      }

      .quiz-dashboard-action-btn-warning {
        border-color: #ffc107;
        color: #ffc107;
      }

      .quiz-dashboard-action-btn-warning:hover {
        background-color: #ffc107;
        color: #212529;
      }

      .quiz-dashboard-action-btn-primary {
        border-color: #0d6efd;
        color: #0d6efd;
      }

      .quiz-dashboard-action-btn-primary:hover {
        background-color: #0d6efd;
        color: white;
      }

      .quiz-dashboard-action-btn-success {
        border-color: #198754;
        color: #198754;
      }

      .quiz-dashboard-action-btn-success:hover {
        background-color: #198754;
        color: white;
      }

      .quiz-dashboard-action-btn-danger {
        border-color: #dc3545;
        color: #dc3545;
      }

      .quiz-dashboard-action-btn-danger:hover {
        background-color: #dc3545;
        color: white;
      }

      /* Responsive */
      @media (max-width: 992px) {
        .quiz-dashboard-stats {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 768px) {
        .quiz-dashboard-container {
          padding: 1rem;
        }

        .quiz-dashboard-header-content {
          flex-direction: column;
          align-items: stretch;
        }

        .quiz-dashboard-create-btn {
          width: 100%;
        }

        .quiz-dashboard-stats {
          grid-template-columns: 1fr;
        }

        .quiz-dashboard-table-wrapper {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          margin: 0 -1rem;
          padding: 0 1rem 2.5rem 1rem;
          scrollbar-width: thin;
          scrollbar-color: #888 #f1f1f1;
        }

        .quiz-dashboard-table-wrapper::after {
          content: '← Swipe to see all actions →';
          position: sticky;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(248, 249, 250, 0.95) 15%, rgba(248, 249, 250, 0.98));
          padding: 0.75rem 1rem;
          font-size: 0.7rem;
          color: #0d6efd;
          pointer-events: none;
          display: block;
          text-align: right;
          font-style: italic;
          font-weight: 600;
          animation: pulse-scroll 2s ease-in-out infinite;
        }

        @keyframes pulse-scroll {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        .quiz-dashboard-table {
          min-width: 900px;
        }

        .quiz-dashboard-table th,
        .quiz-dashboard-table td {
          padding: 0.75rem;
          font-size: 0.875rem;
        }

        .quiz-dashboard-actions {
          gap: 0.35rem;
        }

        .quiz-dashboard-action-btn {
          padding: 0.4rem 0.65rem;
          font-size: 0.9rem;
        }
      }

      @media (max-width: 576px) {
        .quiz-dashboard-container {
          padding: 0.75rem;
        }

        .quiz-dashboard-title-section h1 {
          font-size: 1.4rem;
        }

        .quiz-dashboard-icon {
          font-size: 1.25rem;
          padding: 0.4rem;
          margin-right: 0.75rem;
        }

        .quiz-dashboard-subtitle {
          font-size: 0.9rem;
        }

        .quiz-dashboard-create-btn {
          font-size: 1rem;
          padding: 0.65rem 1.25rem;
        }

        .quiz-dashboard-stat-card {
          padding: 1.25rem;
        }

        .quiz-dashboard-stat-icon {
          padding: 0.85rem;
        }

        .quiz-dashboard-stat-icon i {
          font-size: 1.25rem;
        }

        .quiz-dashboard-stat-label {
          font-size: 0.85rem;
        }

        .quiz-dashboard-stat-value {
          font-size: 1.75rem;
        }

        .quiz-dashboard-card-header {
          padding: 1.25rem;
        }

        .quiz-dashboard-card-title {
          font-size: 1.1rem;
        }

        .quiz-dashboard-empty {
          padding: 2.5rem 1rem;
        }

        .quiz-dashboard-empty-icon i {
          font-size: 3.5rem;
        }

        .quiz-dashboard-empty-title {
          font-size: 1.25rem;
        }

        .quiz-dashboard-empty-text {
          font-size: 0.9rem;
        }

        .quiz-dashboard-empty-btn {
          font-size: 1rem;
          padding: 0.65rem 1.25rem;
        }

        .quiz-dashboard-table {
          min-width: 850px;
        }

        .quiz-dashboard-table th,
        .quiz-dashboard-table td {
          padding: 0.65rem 0.5rem;
          font-size: 0.8rem;
        }

        .quiz-dashboard-actions {
          gap: 0.3rem;
          flex-wrap: nowrap;
          justify-content: flex-start;
        }

        .quiz-dashboard-action-btn {
          padding: 0.4rem 0.6rem;
          font-size: 0.9rem;
        }

        .quiz-dashboard-question-badge {
          padding: 0.4rem 0.85rem;
          font-size: 0.8rem;
        }

        .quiz-dashboard-alert {
          font-size: 0.9rem;
          padding: 0.85rem 1rem;
        }
      }

      @media (max-width: 400px) {
        .quiz-dashboard-title-section h1 {
          font-size: 1.2rem;
        }

        .quiz-dashboard-icon {
          font-size: 1.1rem;
          padding: 0.35rem;
        }

        .quiz-dashboard-stat-value {
          font-size: 1.5rem;
        }

        .quiz-dashboard-table {
          min-width: 800px;
        }
      }
    `}</style>
  );
};

export default QuizDashboardCSS;