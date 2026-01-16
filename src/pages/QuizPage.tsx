/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../api";

interface Question {
  question_number: number;
  question_text: string;
  options: string[];
}

interface QuizSession {
  session_id: string;
  subtest_name: string;
  questions: Question[];
  expires_at: string;
}

const QuizPage = () => {
  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadActiveQuiz = async () => {
      try {
        const response = await fetchAPI("/quiz/active");
        const data = response.data;
        
        setSession(data);

        const expireTime = new Date(data.expires_at).getTime();
        const now = new Date().getTime();
        const secondsLeft = Math.floor((expireTime - now) / 1000);

        if (secondsLeft <= 0) {
            alert("Waktu kuis sudah habis!");
            navigate("/dashboard");
        } else {
            setTimeLeft(secondsLeft);
        }

      } catch (error:any) {
        alert(error.message);
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    loadActiveQuiz();
  }, [navigate]);

  useEffect(() => {
    if (!session || timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, session]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (questionNum: number, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionNum]: option,
    }));
  };

  const handleSubmit = async () => {
    if (!window.confirm("Yakin ingin menyelesaikan kuis ini?")) return;
    await submitQuizProcess();
  };

  const handleAutoSubmit = async () => {
    alert("Waktu habis! Jawaban Anda akan dikirim otomatis.");
    await submitQuizProcess();
  };

  const submitQuizProcess = async () => {
    setIsLoading(true);
    try {
      await fetchAPI("/quiz/submit", {
        method: "POST",
        body: JSON.stringify({ answers: answers }),
      });

      alert("Kuis Selesai! Jawaban berhasil dikirim.");
      navigate("/dashboard");

    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Memuat Kuis...</div>;
  }

  if (!session) return null;

  const currentQuestion = session.questions[currentQuestionIndex];

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", padding: "20px", fontFamily: "sans-serif" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid #ccc" }}>
        <div>
            <h2 style={{ margin: 0 }}>{session.subtest_name}</h2>
            <small>Soal {currentQuestionIndex + 1} dari {session.questions.length}</small>
        </div>
        <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: timeLeft < 60 ? "red" : "black" }}>
            {formatTime(timeLeft)}
        </div>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h3 style={{ marginBottom: "20px" }}>
            {currentQuestion.question_number}. {currentQuestion.question_text}
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {currentQuestion.options.map((option, idx) => {
                const isSelected = answers[currentQuestion.question_number] === option;                
                return (
                    <label 
                        key={idx} 
                        style={{ 
                            padding: "15px", 
                            border: isSelected ? "2px solid #007BFF" : "1px solid #ddd", 
                            borderRadius: "8px", 
                            cursor: "pointer",
                            backgroundColor: isSelected ? "#e6f0ff" : "white",
                            display: "flex",
                            alignItems: "center"
                        }}
                    >
                        <input
                            type="radio"
                            name={`question-${currentQuestion.question_number}`}
                            value={option}
                            checked={isSelected}
                            onChange={() => handleSelectOption(currentQuestion.question_number, option)}
                            style={{ marginRight: "10px" }}
                        />
                        {option}
                    </label>
                );
            })}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
        <button
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            style={{ padding: "10px 20px", cursor: "pointer" }}
        >
            Sebelumnya
        </button>

        {currentQuestionIndex < session.questions.length - 1 ? (
            <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(session.questions.length - 1, prev + 1))}
                style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "4px" }}
            >
                Selanjutnya
            </button>
        ) : (
            <button
                onClick={handleSubmit}
                style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px" }}
            >
                Selesaikan Kuis
            </button>
        )}
      </div>

      <div style={{ marginTop: "30px", display: "flex", gap: "5px", flexWrap: "wrap" }}>
        {session.questions.map((q, idx) => (
            <div 
                key={q.question_number}
                onClick={() => setCurrentQuestionIndex(idx)}
                style={{
                    width: "30px", height: "30px", 
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "1px solid #ccc", borderRadius: "4px",
                    backgroundColor: answers[q.question_number] ? "#007BFF" : "white",
                    color: answers[q.question_number] ? "white" : "black",
                    cursor: "pointer",
                    fontWeight: currentQuestionIndex === idx ? "bold" : "normal",
                    outline: currentQuestionIndex === idx ? "2px solid black" : "none"
                }}
            >
                {q.question_number}
            </div>
        ))}
      </div>
    </div>
  );
};

export default QuizPage;