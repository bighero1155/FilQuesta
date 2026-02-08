import React from 'react';

const UserManagementCSS: React.FC = () => {
  return (
    <style>{`
      .user-management-wrapper {
        position: relative;
        padding: 0 1rem;
      }

      .user-management-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .user-management-title {
        color: white;
        font-weight: bold;
        font-size: 1.75rem;
        margin: 0;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      }

      .btn-add-user {
        background: white;
        color: #667eea;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 25px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        cursor: pointer;
      }

      .btn-add-user:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        background: #f8f9fa;
      }

      .btn-add-user:active {
        transform: translateY(0);
      }

      .table-container {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 15px;
        padding: 1.5rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        overflow: hidden;
      }

      .table-responsive-wrapper {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }

      .user-table {
        width: 100%;
        margin-bottom: 0;
        border-collapse: separate;
        border-spacing: 0;
        min-width: 1200px;
      }

      .user-table thead th {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        font-weight: 600;
        padding: 1rem;
        white-space: nowrap;
        position: sticky;
        top: 0;
        z-index: 10;
        font-size: 0.95rem;
      }

      .user-table thead th:first-child {
        border-top-left-radius: 10px;
      }

      .user-table thead th:last-child {
        border-top-right-radius: 10px;
      }

      .user-table tbody tr {
        transition: all 0.3s ease;
        background: white;
      }

      .user-table tbody tr:hover {
        background: rgba(102, 126, 234, 0.08);
        transform: scale(1.005);
      }

      .user-table tbody td {
        padding: 1rem;
        vertical-align: middle;
        border-bottom: 1px solid rgba(102, 126, 234, 0.1);
        font-size: 0.9rem;
      }

      .wrap-cell {
        white-space: normal;
        word-break: break-word;
        line-height: 1.5;
        max-width: 200px;
      }

      .nowrap-cell {
        white-space: nowrap;
      }

      .name-cell {
        min-width: 150px;
      }

      .name-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
      }

      .name-line {
        line-height: 1.3;
        font-weight: 500;
      }

      .middle-name {
        font-weight: 400;
        opacity: 0.8;
        font-size: 0.85em;
      }

      /* Role Badges - NEW COLORS */
      .badge-role {
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.85rem;
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        white-space: nowrap;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
      }

      /* Student Badge - Light Green */
      .badge-student {
        background: linear-gradient(135deg, #66d9a8, #52c995);
        color: white;
        border: 2px solid #4ab887;
      }

      .badge-student:hover {
        background: linear-gradient(135deg, #52c995, #42b580);
        box-shadow: 0 4px 12px rgba(82, 201, 149, 0.4);
      }

      /* Teacher Badge - Cyan */
      .badge-teacher {
        background: linear-gradient(135deg, #00d4ff, #00b4d8);
        color: white;
        border: 2px solid #0096b8;
      }

      .badge-teacher:hover {
        background: linear-gradient(135deg, #00b4d8, #0096b8);
        box-shadow: 0 4px 12px rgba(0, 180, 216, 0.4);
      }

      .role-cell {
        text-align: center;
      }

      .action-buttons {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        justify-content: center;
      }

      .btn-action {
        border: none;
        padding: 0.5rem 0.875rem;
        border-radius: 8px;
        transition: all 0.3s ease;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.875rem;
        font-weight: 600;
        white-space: nowrap;
      }

      .btn-edit {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
      }

      .btn-edit:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        background: linear-gradient(135deg, #5568d3, #663a91);
      }

      .btn-edit:active {
        transform: translateY(0);
      }

      .btn-delete {
        background: linear-gradient(135deg, #f5576c, #f093fb);
        color: white;
        box-shadow: 0 2px 8px rgba(245, 87, 108, 0.3);
      }

      .btn-delete:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
        background: linear-gradient(135deg, #e4465b, #df82ea);
      }

      .btn-delete:active {
        transform: translateY(0);
      }

      .no-users-alert {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 15px;
        padding: 2rem;
        text-align: center;
        color: #667eea;
        font-weight: 600;
        margin-top: 1rem;
      }

      /* Modal Styles */
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 1rem;
        overflow-y: auto;
      }

      .modal-container {
        background: white;
        border-radius: 20px;
        max-width: 800px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: modalSlideIn 0.3s ease-out;
        margin: auto;
      }

      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .modal-header-custom {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 1.5rem;
        border-radius: 20px 20px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: sticky;
        top: 0;
        z-index: 10;
      }

      .modal-title {
        font-size: 1.25rem;
        font-weight: bold;
        margin: 0;
        word-break: break-word;
        padding-right: 1rem;
      }

      .btn-close-custom {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        flex-shrink: 0;
      }

      .btn-close-custom:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.3);
        transform: rotate(90deg);
      }

      .btn-close-custom:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .modal-body-custom {
        padding: 2rem;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .form-label-custom {
        font-weight: 600;
        color: #667eea;
        font-size: 0.9rem;
      }

      .form-label-required::after {
        content: " *";
        color: #f5576c;
      }

      .form-input,
      .form-select {
        padding: 0.75rem;
        border: 2px solid #e0e7ff;
        border-radius: 10px;
        font-size: 1rem;
        transition: all 0.3s ease;
        background: white;
        width: 100%;
      }

      .form-input:focus,
      .form-select:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .form-input:disabled,
      .form-select:disabled {
        background: #f5f5f5;
        cursor: not-allowed;
      }

      .form-input.is-invalid,
      .form-select.is-invalid {
        border-color: #f5576c;
      }

      .invalid-feedback {
        color: #f5576c;
        font-size: 0.85rem;
        margin-top: 0.25rem;
      }

      .modal-footer-custom {
        padding: 1.5rem;
        border-top: 2px solid #f0f0f0;
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        position: sticky;
        bottom: 0;
        background: white;
        border-radius: 0 0 20px 20px;
      }

      .btn-modal {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        white-space: nowrap;
      }

      .btn-modal:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .btn-cancel {
        background: #e0e7ff;
        color: #667eea;
      }

      .btn-cancel:hover:not(:disabled) {
        background: #d0d7ef;
      }

      .btn-save {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
      }

      .btn-save:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      }

      .btn-save:active:not(:disabled) {
        transform: translateY(0);
      }

      /* Tablet Responsive */
      @media (max-width: 1024px) {
        .user-table {
          min-width: 1000px;
        }

        .table-container {
          padding: 1rem;
        }

        .user-management-title {
          font-size: 1.5rem;
        }
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .user-management-wrapper {
          padding: 0 0.5rem;
        }

        .user-management-header {
          flex-direction: column;
          align-items: stretch;
          gap: 0.75rem;
        }

        .user-management-title {
          font-size: 1.35rem;
          text-align: center;
        }

        .btn-add-user {
          width: 100%;
          justify-content: center;
          padding: 0.875rem 1.25rem;
        }

        .table-container {
          padding: 0.75rem;
          border-radius: 12px;
        }

        /* Make table cards on mobile */
        .table-responsive-wrapper {
          overflow-x: auto;
        }

        .user-table {
          min-width: 900px;
          font-size: 0.85rem;
        }

        .user-table thead th,
        .user-table tbody td {
          padding: 0.75rem 0.5rem;
          font-size: 0.85rem;
        }

        .badge-role {
          padding: 0.4rem 0.75rem;
          font-size: 0.8rem;
        }

        .btn-action {
          padding: 0.4rem 0.75rem;
          font-size: 0.8rem;
        }

        .btn-action span {
          display: none;
        }

        .action-buttons {
          flex-direction: row;
          gap: 0.4rem;
        }

        /* Modal adjustments */
        .modal-overlay {
          padding: 0.5rem;
        }

        .modal-container {
          max-height: 95vh;
          border-radius: 15px;
        }

        .modal-header-custom {
          padding: 1rem;
          border-radius: 15px 15px 0 0;
        }

        .modal-title {
          font-size: 1.1rem;
        }

        .btn-close-custom {
          width: 32px;
          height: 32px;
        }

        .modal-body-custom {
          padding: 1.25rem;
        }

        .form-grid {
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }

        .modal-footer-custom {
          padding: 1rem;
          flex-direction: column-reverse;
          gap: 0.75rem;
        }

        .btn-modal {
          width: 100%;
          justify-content: center;
          padding: 0.875rem 1.25rem;
        }
      }

      /* Small Mobile */
      @media (max-width: 480px) {
        .user-management-title {
          font-size: 1.2rem;
        }

        .btn-add-user {
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
        }

        .btn-add-user-text {
          display: inline;
        }

        .table-container {
          padding: 0.5rem;
        }

        .user-table {
          min-width: 800px;
          font-size: 0.8rem;
        }

        .user-table thead th,
        .user-table tbody td {
          padding: 0.6rem 0.4rem;
          font-size: 0.8rem;
        }

        .badge-role {
          padding: 0.35rem 0.6rem;
          font-size: 0.75rem;
        }

        .btn-action {
          padding: 0.35rem 0.6rem;
        }

        .modal-title {
          font-size: 1rem;
        }

        .form-input,
        .form-select {
          padding: 0.625rem;
          font-size: 0.95rem;
        }

        .modal-body-custom {
          padding: 1rem;
        }

        .form-grid {
          gap: 1rem;
        }
      }

      /* Ultra-wide screens */
      @media (min-width: 1400px) {
        .table-container {
          padding: 2rem;
        }

        .user-table thead th,
        .user-table tbody td {
          padding: 1.25rem;
        }

        .form-grid {
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        }
      }

      /* Scrollbar styling */
      .table-responsive-wrapper::-webkit-scrollbar {
        height: 8px;
      }

      .table-responsive-wrapper::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }

      .table-responsive-wrapper::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 10px;
      }

      .table-responsive-wrapper::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #5568d3, #663a91);
      }

      .modal-container::-webkit-scrollbar {
        width: 8px;
      }

      .modal-container::-webkit-scrollbar-track {
        background: #f1f1f1;
      }

      .modal-container::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 10px;
      }

      .modal-container::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #5568d3, #663a91);
      }

      /* Print styles */
      @media print {
        .btn-add-user,
        .action-buttons,
        .modal-overlay {
          display: none !important;
        }

        .table-container {
          box-shadow: none;
          border: 1px solid #ddd;
        }

        .user-table {
          min-width: auto;
        }
      }
    `}</style>
  );
};

export default UserManagementCSS;