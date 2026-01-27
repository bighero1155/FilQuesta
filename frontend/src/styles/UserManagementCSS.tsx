import React from 'react';

const UserManagementCSS: React.FC = () => {
  return (
    <style>{`
      .user-management-wrapper {
        position: relative;
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
        font-size: 1.5rem;
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

      .table-container {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 15px;
        padding: 1.5rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        overflow-x: auto;
      }

      .user-table {
        width: 100%;
        margin-bottom: 0;
        border-collapse: separate;
        border-spacing: 0;
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
        background: rgba(102, 126, 234, 0.1);
        transform: scale(1.01);
      }

      .user-table tbody td {
        padding: 1rem;
        vertical-align: middle;
        border-bottom: 1px solid rgba(102, 126, 234, 0.1);
      }

      .wrap-cell {
        white-space: normal;
        word-break: break-word;
        line-height: 1.4;
        max-width: 200px;
      }

      .nowrap-cell {
        white-space: nowrap;
      }

      .name-cell div {
        line-height: 1.3;
      }

      .badge-role {
        padding: 0.4rem 0.8rem;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.85rem;
        display: inline-block;
      }

      .badge-student {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
      }

      .badge-teacher {
        background: linear-gradient(135deg, #f093fb, #f5576c);
        color: white;
      }

      .action-buttons {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .btn-action {
        border: none;
        padding: 0.5rem 0.75rem;
        border-radius: 8px;
        transition: all 0.3s ease;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.875rem;
        font-weight: 500;
      }

      .btn-edit {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
      }

      .btn-edit:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
      }

      .btn-delete {
        background: linear-gradient(135deg, #f5576c, #f093fb);
        color: white;
      }

      .btn-delete:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(245, 87, 108, 0.3);
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
        z-index: 1000;
        padding: 1rem;
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
      }

      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
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
      }

      .modal-title {
        font-size: 1.25rem;
        font-weight: bold;
        margin: 0;
      }

      .btn-close-custom {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .btn-close-custom:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: rotate(90deg);
      }

      .modal-body-custom {
        padding: 2rem;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
      }

      .form-input:focus,
      .form-select:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .modal-footer-custom {
        padding: 1.5rem;
        border-top: 2px solid #f0f0f0;
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
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
      }

      .btn-cancel {
        background: #e0e7ff;
        color: #667eea;
      }

      .btn-cancel:hover {
        background: #d0d7ef;
      }

      .btn-save {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
      }

      .btn-save:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      }

      @media (max-width: 768px) {
        .user-management-title {
          font-size: 1.25rem;
        }

        .table-container {
          padding: 1rem;
        }

        .user-table thead th,
        .user-table tbody td {
          padding: 0.75rem;
          font-size: 0.875rem;
        }

        .form-grid {
          grid-template-columns: 1fr;
        }

        .modal-body-custom {
          padding: 1.5rem;
        }
      }
    `}</style>
  );
};

export default UserManagementCSS;