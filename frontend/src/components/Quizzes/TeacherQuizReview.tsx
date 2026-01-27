// src/components/Teacher/TeacherQuizReview.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../auth/axiosInstance";
import BackButton from "../BackButton";

interface QuizReviewQuestion {
  question_id: number;
  question_text: string;
  question_image?: string;
  is_identification: boolean;
  options: Array<{
    option_id: number;
    option_text: string;
    is_correct: boolean;
  }>;
  student_answer: number | string | null;
  correct_answer: number | string;
  is_correct: boolean;
}

interface QuizReviewData {
  participant?: {
    student_id: number;
    score: number;
    finished_at: string;
  };
  quiz_title: string;
  total_questions: number;
  questions: QuizReviewQuestion[];
}

const TeacherQuizReview: React.FC = () => {
  const { sessionId, studentId } = useParams<{ sessionId: string; studentId: string }>();

  const [reviewData, setReviewData] = useState<QuizReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchReview = async () => {
      if (!sessionId || !studentId) return;

      try {
        const response = await axios.get(`/shared-sessions/${sessionId}/review/${studentId}`);
        console.log("Review data:", response.data);
        setReviewData(response.data);
      } catch (error) {
        console.error("Error fetching quiz review:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [sessionId, studentId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}>⏳</div>
        <p>Loading quiz review...</p>
      </div>
    );
  }

  if (!reviewData) {
    return (
      <div style={styles.errorContainer}>
        <p>Unable to load quiz review</p>
        <button onClick={() => window.close()} style={styles.backBtn}>
          Close Window
        </button>
      </div>
    );
  }

  const exportToWord = async () => {
    if (!reviewData) return;
    
    setExporting(true);
    
    try {
      let htmlContent = `
        <!DOCTYPE html>
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset="utf-8">
          <title>${reviewData.quiz_title} - Review</title>
          <!--[if gte mso 9]>
          <xml>
            <w:WordDocument>
              <w:View>Print</w:View>
              <w:Zoom>100</w:Zoom>
            </w:WordDocument>
          </xml>
          <![endif]-->
          <style>
            @page {
              size: 8.5in 11in;
              margin: 1in;
            }
            body { 
              font-family: Calibri, Arial, sans-serif;
              font-size: 11pt;
              line-height: 1.5;
              color: #000;
              margin: 0;
              padding: 0;
            }
            h1 { 
              font-size: 18pt;
              font-weight: bold;
              color: #000;
              margin: 0 0 20pt 0;
              text-align: center;
            }
            .header-info { 
              border-bottom: 1pt solid #000;
              padding-bottom: 12pt;
              margin-bottom: 20pt;
            }
            .info-line { 
              margin: 5pt 0;
              font-size: 11pt;
            }
            .info-label { 
              font-weight: bold;
            }
            .question { 
              margin: 20pt 0;
              page-break-inside: avoid;
            }
            .question-header { 
              font-weight: bold;
              margin-bottom: 8pt;
              font-size: 11pt;
            }
            .question-text { 
              margin: 8pt 0;
              font-size: 11pt;
            }
            .question-image { 
            width: 220px;
            max-width: 220px;
            height: auto;
            margin: 8pt 0;
            display: block;
            }
            .answer-section { 
              margin: 10pt 0 10pt 20pt;
            }
            .answer-line {
              margin: 5pt 0;
            }
            .option { 
              margin: 5pt 0 5pt 20pt;
            }
            .correct-marker { 
              color: green;
              font-weight: bold;
            }
            .incorrect-marker { 
              color: red;
              font-weight: bold;
            }
            .student-answer-label { 
              font-style: italic;
              color: #666;
              font-size: 10pt;
            }
          </style>
        </head>
        <body>
          <h1>${reviewData.quiz_title} - Student Review</h1>
          
          <div class="header-info">
            <div class="info-line">
              <span class="info-label">Score:</span> ${reviewData.participant?.score} / ${reviewData.total_questions} (${(((reviewData.participant?.score || 0) / reviewData.total_questions) * 100).toFixed(1)}%)
            </div>
            <div class="info-line">
              <span class="info-label">Completed:</span> ${reviewData.participant?.finished_at ? new Date(reviewData.participant.finished_at).toLocaleDateString() : 'N/A'}
            </div>
          </div>
      `;

      reviewData.questions.forEach((question, index) => {
        const statusText = question.is_correct ? '[CORRECT]' : '[INCORRECT]';
        const statusClass = question.is_correct ? 'correct-marker' : 'incorrect-marker';
        
        htmlContent += `
          <div class="question">
            <div class="question-header">
              Question ${index + 1}. <span class="${statusClass}">${statusText}</span>
            </div>
            <div class="question-text">${question.question_text}</div>
        `;

        if (question.question_image) {
        htmlContent += `
            <img 
            src="${question.question_image}"
            alt="Question image"
            width="160"
            height="160"
            />
        `;
        }

        if (question.is_identification) {
          htmlContent += `
            <div class="answer-section">
              <div class="answer-line">
                <strong>Student's Answer:</strong> 
                <span class="${question.is_correct ? 'correct-marker' : 'incorrect-marker'}">
                  ${question.student_answer || '(No answer provided)'}
                </span>
              </div>
          `;
          
          if (!question.is_correct) {
            htmlContent += `
              <div class="answer-line">
                <strong>Correct Answer:</strong> 
                <span class="correct-marker">${question.correct_answer}</span>
              </div>
            `;
          }
          
          htmlContent += `</div>`;
        } else {
          htmlContent += `<div class="answer-section">`;
          
          question.options.forEach((option, optIndex) => {
            const isStudentAnswer = option.option_id === question.student_answer;
            const isCorrectAnswer = option.is_correct;
            
            const letter = String.fromCharCode(65 + optIndex);
            let marker = '';
            let label = '';
            
            if (isCorrectAnswer) {
              marker = '<span class="correct-marker">[CORRECT ANSWER]</span> ';
            }
            if (isStudentAnswer) {
              label = ' <span class="student-answer-label">(Student\'s answer)</span>';
            }
            
            htmlContent += `<div class="option">${letter}. ${marker}${option.option_text}${label}</div>`;
          });
          
          htmlContent += `</div>`;
        }

        htmlContent += `</div>`;
      });

      htmlContent += `
        </body>
        </html>
      `;

      const blob = new Blob(['\ufeff', htmlContent], { 
        type: 'application/msword' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reviewData.quiz_title.replace(/[^a-z0-9]/gi, '_')}_Review.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert('Review exported successfully as a Word document!');
    } catch (error) {
      console.error('Error exporting review:', error);
      alert('Failed to export review. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Print styles */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
          }
          
          .no-print {
            display: none !important;
          }
          
          .page {
            background-color: white !important;
            padding: 0 !important;
            min-height: auto !important;
          }
          
          .document {
            box-shadow: none !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0.5in !important;
          }
          
          .question {
            page-break-inside: avoid;
          }
          
          img {
            width: 80px !important;
            height: 80px !important;
            max-width: 80px !important;
            object-fit: contain !important;
            page-break-inside: avoid;
          }
        }
      `}</style>

      {/* Word Document Style Header */}
      <div style={styles.documentHeader} className="no-print">
        <BackButton />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={handlePrint}
            style={styles.printButton}
          >
            🖨️ Print
          </button>
          <button 
            onClick={exportToWord} 
            disabled={exporting}
            style={styles.exportButton}
          >
            {exporting ? '⏳ Exporting...' : '📄 Export to Word'}
          </button>
        </div>
      </div>

      <div style={styles.document} className="document">
        {/* Title */}
        <h1 style={styles.docTitle}>{reviewData.quiz_title} - Student Review</h1>

        {/* Header Info */}
        <div style={styles.headerInfo}>
          <div style={styles.infoLine}>
            <span style={styles.infoLabel}>Score:</span> {reviewData.participant?.score} / {reviewData.total_questions} ({(((reviewData.participant?.score || 0) / reviewData.total_questions) * 100).toFixed(1)}%)
          </div>
          <div style={styles.infoLine}>
            <span style={styles.infoLabel}>Completed:</span> {reviewData.participant?.finished_at 
              ? new Date(reviewData.participant.finished_at).toLocaleDateString()
              : 'N/A'}
          </div>
        </div>

        {/* Questions */}
        {reviewData.questions.map((question, index) => (
          <div key={question.question_id} style={styles.question}>
            <div style={styles.questionHeader}>
              Question {index + 1}. {' '}
              <span style={question.is_correct ? styles.correctMarker : styles.incorrectMarker}>
                {question.is_correct ? '[CORRECT]' : '[INCORRECT]'}
              </span>
            </div>
            
            <div style={styles.questionText}>{question.question_text}</div>
            
            {question.question_image && (
              <img
                src={question.question_image}
                alt="Question"
                style={styles.questionImage}
              />
            )}

            {question.is_identification ? (
              <div style={styles.answerSection}>
                <div style={styles.answerLine}>
                  <strong>Student's Answer:</strong>{' '}
                  <span style={question.is_correct ? styles.correctMarker : styles.incorrectMarker}>
                    {question.student_answer || "(No answer provided)"}
                  </span>
                </div>
                {!question.is_correct && (
                  <div style={styles.answerLine}>
                    <strong>Correct Answer:</strong>{' '}
                    <span style={styles.correctMarker}>{question.correct_answer}</span>
                  </div>
                )}
              </div>
            ) : (
              <div style={styles.answerSection}>
                {question.options.map((option, optIndex) => {
                  const isStudentAnswer = option.option_id === question.student_answer;
                  const isCorrectAnswer = option.is_correct;
                  const letter = String.fromCharCode(65 + optIndex);

                  return (
                    <div key={option.option_id} style={styles.option}>
                      {letter}. {' '}
                      {isCorrectAnswer && (
                        <span style={styles.correctMarker}>[CORRECT ANSWER]</span>
                      )}{' '}
                      {option.option_text}
                      {isStudentAnswer && (
                        <span style={styles.studentAnswerLabel}> (Student's answer)</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {/* Footer */}
        <div style={styles.footer} className="no-print">
          <button onClick={() => window.close()} style={styles.closeButton}>
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
    padding: "20px",
  },
  documentHeader: {
    maxWidth: "8.5in",
    margin: "0 auto 20px auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
  },
  printButton: {
    padding: "10px 20px",
    fontSize: "0.95rem",
    fontWeight: "600",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    color: "#333",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  exportButton: {
    padding: "10px 20px",
    fontSize: "0.95rem",
    fontWeight: "600",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    color: "#333",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  document: {
    maxWidth: "8.5in",
    minHeight: "11in",
    margin: "0 auto",
    padding: "1in",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "Calibri, Arial, sans-serif",
    fontSize: "11pt",
    lineHeight: "1.5",
    color: "#000",
  },
  docTitle: {
    fontSize: "18pt",
    fontWeight: "bold",
    textAlign: "center" as const,
    margin: "0 0 20px 0",
    color: "#000",
  },
  headerInfo: {
    borderBottom: "1pt solid #000",
    paddingBottom: "12pt",
    marginBottom: "20pt",
  },
  infoLine: {
    margin: "5pt 0",
    fontSize: "11pt",
  },
  infoLabel: {
    fontWeight: "bold",
  },
  question: {
    marginTop: "20pt",
    marginBottom: "20pt",
  },
  questionHeader: {
    fontWeight: "bold",
    marginBottom: "8pt",
    fontSize: "11pt",
  },
  questionText: {
    margin: "8pt 0",
    fontSize: "11pt",
  },
  questionImage: {
    maxWidth: "400px",
    height: "auto",
    margin: "10pt 0",
    display: "block",
  },
  answerSection: {
    marginLeft: "20pt",
    marginTop: "10pt",
  },
  answerLine: {
    margin: "5pt 0",
  },
  option: {
    margin: "5pt 0",
    marginLeft: "20pt",
  },
  correctMarker: {
    color: "green",
    fontWeight: "bold",
  },
  incorrectMarker: {
    color: "red",
    fontWeight: "bold",
  },
  studentAnswerLabel: {
    fontStyle: "italic",
    color: "#666",
    fontSize: "10pt",
  },
  footer: {
    marginTop: "40pt",
    paddingTop: "20pt",
    borderTop: "1pt solid #ccc",
    textAlign: "center" as const,
  },
  closeButton: {
    padding: "10px 30px",
    fontSize: "11pt",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    color: "#333",
    cursor: "pointer",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
    fontSize: "1.2rem",
    color: "#6b7280",
  },
  spinner: {
    fontSize: "3rem",
    marginBottom: "20px",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
  },
  backBtn: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    color: "#333",
    cursor: "pointer",
  },
};

export default TeacherQuizReview;