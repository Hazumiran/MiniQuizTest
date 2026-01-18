/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../api";
import { handleApi401 } from "../utils/authHelper";
import toast from "react-hot-toast";
import Modal from "../components/Modal";

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
  const [openSubmit, setOpenSubmit] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [titleModal, setTitleModal] = useState<string>("");
  const [descriptionModal, setDescriptionModal] = useState<string>("");
  const [modalType, setModalType] = useState<"submit" | "locked">("submit");
  
  const navigate = useNavigate();

  const tabIdRef = useRef<string>(
    sessionStorage.getItem("QUIZ_TAB_ID") || crypto.randomUUID()
  );
  if (!sessionStorage.getItem("QUIZ_TAB_ID")) {
    sessionStorage.setItem("QUIZ_TAB_ID", tabIdRef.current);
  }
  const TAB_ID = tabIdRef.current;

  const buildEmptyAnswers = (questions: Question[]) =>{    
    return Object.fromEntries(
      questions.map(q => [String(q.question_number), ""])
    );
  }

  useEffect(() => {
    if (!session) return;

    const QUIZ_TAB_KEY = `ACTIVE_QUIZ_TAB_${session.session_id}`;
    const activeTab = localStorage.getItem(QUIZ_TAB_KEY);

    if (!activeTab) {
      localStorage.setItem(QUIZ_TAB_KEY, TAB_ID);
    } else if (activeTab !== TAB_ID) {
      setTitleModal("Oopps....");
      setDescriptionModal("Sesi kuis ini sedang aktif di tab lain. Anda tidak bisa mengerjakan kuis di tab ini.")
      setOpenSubmit(true);
      setModalType("locked");
      return;
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === QUIZ_TAB_KEY && e.newValue !== TAB_ID) {        
        toast.error("Sesi kuis ini sedang aktif di tab lain. Anda tidak bisa mengerjakan kuis di tab ini.");
        navigate("/dashboard");
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      if (localStorage.getItem(QUIZ_TAB_KEY) === TAB_ID) {
        localStorage.removeItem(QUIZ_TAB_KEY);
      }
    };
  }, [session, TAB_ID, navigate]);

  const loadActiveQuiz = async () => {
    try {
      const response = await fetchAPI("/quiz/active");
      if (handleApi401(response, navigate)) return;
      if (!response.success) {
        toast.error(response.message);
        navigate("/dashboard");
        return;
      }

      const data = response.data;
      setSession(data);

      const expireTime = new Date(data.expires_at).getTime();
      const now = new Date().getTime();
      const secondsLeft = Math.floor((expireTime - now) / 1000);

      if (secondsLeft <= 0) {
        toast.error("Waktu kuis sudah habis!");
        await submitQuizProcess(data);
        navigate("/dashboard");
      } else {
        setTimeLeft(secondsLeft);
      }
    } catch (error:any) {
      toast.error(error.message);
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadActiveQuiz();
  }, []);

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
  }, [session]);

  useEffect(() => {
    if (!session) return;

    const saved = localStorage.getItem(
      `quiz_answers_${session.session_id}`
    );

    if(saved) {
      setAnswers(JSON.parse(saved));
    }else{
      setAnswers(buildEmptyAnswers(session.questions));
    }

    localStorage.setItem(
      `quiz_answers_${session.session_id}`,
      JSON.stringify(answers)
    );
  }, [session]);

  useEffect(() => {
    if (!session) return;

    localStorage.setItem(
      `quiz_answers_${session.session_id}`,
      JSON.stringify(answers)
    );
  }, [answers, session]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (questionNum: number, optionIndex: number) => {
    const answerLetter = String.fromCharCode(65 + optionIndex);
    setAnswers((prev) => ({
      ...prev,
      [String(questionNum)]: answerLetter,
    }));
  };

  const handleSubmit = async () => {
    if (!session) return;

    const allAnswered = session.questions.every(
      q => answers[q.question_number] && answers[q.question_number] !== ""
    );

    if (!allAnswered && timeLeft > 0) {
      toast.error("Anda harus menjawab semua soal sebelum mengirim kuis!");
      return;
    }
    setTitleModal("Konfirmasi Submit Kuis");
    setDescriptionModal("Yakin ingin menyelesaikan kuis ini ? Jangan lupa untuk memeriksa kembali jawaban anda")
    setOpenSubmit(true);
    
  };

  const handleAutoSubmit = async () => {
    toast.error("Waktu habis! Jawaban Anda akan dikirim otomatis.");
    await submitQuizProcess();
  };

  const submitQuizProcess = async (sessionData: QuizSession = session as QuizSession) => {
    setIsLoading(true);
    try {
      const savedAnswers = localStorage.getItem(
        `quiz_answers_${sessionData.session_id}`
      );

      const finalAnswers = savedAnswers
        ? JSON.parse(savedAnswers)
        : buildEmptyAnswers(sessionData.questions);
        
      const res = await fetchAPI("/quiz/submit", {
        method: "POST",
        body: JSON.stringify({ answers: finalAnswers }),
      });
      if (handleApi401(res, navigate)) return;
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      if (session) {
        const finalResult = await fetchAPI(`/quiz/result/${session.session_id}`, {
          method: "GET"
        });
        setQuizResult(finalResult.data);

        releaseQuizLock(sessionData.session_id);
        localStorage.removeItem(`quiz_answers_${session.session_id}`);
      }
      
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const releaseQuizLock = (sessionId: string) => {
    const QUIZ_TAB_KEY = `ACTIVE_QUIZ_TAB_${sessionId}`;
    if (localStorage.getItem(QUIZ_TAB_KEY) === TAB_ID) {
      localStorage.removeItem(QUIZ_TAB_KEY);
    }
  };

  if (quizResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">{quizResult.result.subtest_name}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">          
          <div className="p-6 rounded-xl shadow-lg bg-gradient-to-tl from-cyan-200 to-blue-600 flex flex-col items-center justify-center">
            <p className="text-white text-lg font-semibold">Score</p>
            <p className="text-4xl font-bold text-white mt-2">{quizResult.result.score}</p>
          </div>

          <div className="p-6 rounded-xl shadow-lg bg-gradient-to-tl from-cyan-200 to-blue-600 flex flex-col items-center justify-center">
            <p className="text-white text-lg font-semibold">Persentase</p>
            <p className="text-4xl font-bold text-white mt-2">{quizResult.result.percentage}%</p>
          </div>

          <div className="p-6 rounded-xl shadow-lg bg-gradient-to-tl from-cyan-200 to-blue-600 flex flex-col items-center justify-center">
            <p className="text-white text-lg font-semibold">Total Soal</p>
            <p className="text-2xl font-bold text-white mt-1">{quizResult.result.total_questions}</p>
          </div>

          <div className="p-6 rounded-xl shadow-lg bg-gradient-to-tl from-cyan-200 to-blue-600 flex flex-col items-center justify-center">
            <p className="text-white text-lg font-semibold">Jawaban Benar</p>
            <p className="text-2xl font-bold text-white mt-1">{quizResult.result.correct_answers}</p>
          </div>

          <div className="p-6 rounded-xl shadow-lg bg-gradient-to-tl from-cyan-200 to-blue-600 flex flex-col items-center justify-center">
            <p className="text-white text-lg font-semibold">Total Waktu</p>
            <p className="text-2xl font-bold text-white mt-1">{quizResult.result.total_time_seconds}s</p>
          </div>

          <div className="p-6 rounded-xl shadow-lg bg-gradient-to-tl from-cyan-200 to-blue-600 flex flex-col items-center justify-center">
            <p className="text-white text-lg font-semibold">Rata-rata Waktu/Soal</p>
            <p className="text-2xl font-bold text-white mt-1">{quizResult.result.average_time_per_question}s</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-700 mb-2">
            Selesai pada: {new Date(quizResult.result.completed_at).toLocaleString()}
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Memuat Kuis...</div>;
  }

  if (!session) return null;
  const currentQuestion = session.questions[currentQuestionIndex];

  return (
    <div className="w-full min-h-screen p-4 flex flex-col gap-6 font-sans">
      <div className="p-8">
       <Modal
  open={openSubmit}
  setOpen={setOpenSubmit}
  title={titleModal}
  description={descriptionModal}
  primaryAction={{
    label: modalType === "locked" ? "Kembali ke Dashboard" : "Ya",
    onClick: () => {
      if (modalType === "locked") {
        navigate("/dashboard");
      } else {
        submitQuizProcess();
      }
    },
    color: "blue",
  }}
  secondaryAction={modalType === "locked" ? undefined : {
    label: "Batal",
    onClick: () => setOpenSubmit(false),
  }}
/>

      </div>
      <div className="flex justify-between items-center border-b border-gray-300 pb-2">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{session.subtest_name}</h2>
          <small className="text-gray-500">Soal {currentQuestionIndex + 1} dari {session.questions.length}</small>
        </div>
        <div className={`text-xl font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-gray-800'}`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex w-full gap-4">
        <div className="flex-shrink-0 w-24 md:w-28">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {session.questions.map((q, idx) => {
              const isActive = currentQuestionIndex === idx;
              const isAnswered = answers[q.question_number];
              return (
                <div
                  key={q.question_number}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`flex items-center justify-center h-10 border cursor-pointer transition
                    ${isAnswered ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}
                    ${isActive ? 'ring-2 ring-blue-400' : ''}
                    rounded-sm
                  `}
                >
                  {q.question_number}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            {currentQuestion.question_number}. {currentQuestion.question_text}
          </h3>

          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = answers[currentQuestion.question_number] === String.fromCharCode(65 + idx);
              return (
                <label
                  key={idx}
                  className={`flex items-center px-4 py-3 border rounded-sm cursor-pointer transition
                    ${isSelected ? 'bg-blue-50 border-blue-400' : 'border-gray-300 hover:bg-gray-50'}
                  `}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.question_number}`}
                    value={String.fromCharCode(65 + idx)}
                    checked={isSelected}
                    onChange={() => handleSelectOption(currentQuestion.question_number, idx)}
                    className="mr-3 accent-blue-500"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              );
            })}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-sm border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Sebelumnya
            </button>

            {currentQuestionIndex < session.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(session.questions.length - 1, prev + 1))}
                className="px-3 py-2 rounded-sm bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Selanjutnya
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-3 py-2 rounded-sm bg-green-600 text-white hover:bg-green-700 transition"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;