// scripts/insertQuiz.js
const mongoose = require('mongoose');
const Quiz = require('../models/quiz'); // path to your Quiz model
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://adity07:mongoose123@cluster0.nt08p.mongodb.net/RishiVerse?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));


  const data = [
    {
      level: "Beginner",
      questions: [
        {
          questionText: "Who is known as the father of Ayurveda?",
          options: ["Charaka", "Sushruta", "Bhela", "Atreya"],
          correctAnswer: 0,
          fact: "Charaka is known as the father of Ayurveda, having written the 'Charaka Samhita' which is one of the foundational texts."
        },
        {
          questionText: "Which river is considered the holiest in India?",
          options: ["Ganga", "Yamuna", "Sarasvati", "Indus"],
          correctAnswer: 0,
          fact: "The Ganga River is considered the holiest river in India and is worshipped as a goddess."
        },
        {
          questionText: "Which famous cave in India is home to ancient Buddhist paintings?",
          options: ["Ajanta Caves", "Elephanta Caves", "Borra Caves", "Badami Caves"],
          correctAnswer: 0,
          fact: "The Ajanta Caves are known for their ancient Buddhist paintings and sculptures."
        },
        {
          questionText: "Which of the following is India's national flower?",
          options: ["Lotus", "Rose", "Jasmine", "Tulip"],
          correctAnswer: 0,
          fact: "The Lotus is India's national flower, symbolizing purity and beauty."
        },
        {
          questionText: "In Ayurveda, which element is primarily associated with Vata dosha?",
          options: ["Fire and Water", "Air and Ether", "Earth and Water", "Fire and Earth"],
          correctAnswer: 1,
          fact: "Vata dosha is primarily associated with the elements of Air and Ether and governs movement in the body."
        }
      ]
    },
    {
      level: "Intermediate",
      questions: [
        {
          questionText: "Which river is known as the lifeline of Southern India?",
          options: ["Kaveri", "Krishna", "Godavari", "Narmada"],
          correctAnswer: 0,
          fact: "The Kaveri River is often called the lifeline of Southern India due to its importance for irrigation and religious significance."
        },
        {
          questionText: "Which of these caves in India are a UNESCO World Heritage Site?",
          options: ["Ajanta Caves", "Elephanta Caves", "Bodhgaya", "All of the Above"],
          correctAnswer: 3,
          fact: "The Ajanta, Elephanta, and other caves in India are UNESCO World Heritage Sites due to their historical and cultural significance."
        },
        {
          questionText: "Who wrote the ancient Sanskrit text 'Arthashastra'?",
          options: ["Chanakya", "Panini", "Aryabhata", "Kalidasa"],
          correctAnswer: 0,
          fact: "Chanakya, also known as Kautilya, authored the 'Arthashastra,' a treatise on statecraft, economics, and military strategy."
        },
        {
          questionText: "Which is the longest river in India?",
          options: ["Ganga", "Godavari", "Yamuna", "Indus"],
          correctAnswer: 0,
          fact: "The Ganga River is the longest river in India, spanning over 2,500 kilometers."
        },
        {
          questionText: "What is the concept of 'Panchakarma' in Ayurveda?",
          options: ["Yoga for detoxification", "Dietary regimen for weight loss", "Therapeutic purification treatments", "Psychological therapy"],
          correctAnswer: 2,
          fact: "Panchakarma is a set of five therapeutic purification treatments in Ayurveda for detoxifying the body and mind."
        }
      ]
    },
    {
      level: "Expert",
      questions: [
        {
          questionText: "Which ancient Indian text is considered the earliest known work on grammar?",
          options: ["Panini's Ashtadhyayi", "Vishnu Purana", "Rigveda", "Kautilya's Arthashastra"],
          correctAnswer: 0,
          fact: "Panini's 'Ashtadhyayi' is the earliest known work on grammar and is regarded as the foundation of Sanskrit grammar."
        },
        {
          questionText: "In Ayurveda, which herb is considered an adaptogen and commonly used to manage stress?",
          options: ["Ashwagandha", "Brahmi", "Tulsi", "Shatavari"],
          correctAnswer: 0,
          fact: "Ashwagandha is an adaptogenic herb in Ayurveda known for its ability to help the body manage stress and improve vitality."
        },
        {
          questionText: "Which of the following rivers is known as the 'Sarasvati of the South'?",
          options: ["Kaveri", "Narmada", "Godavari", "Krishna"],
          correctAnswer: 0,
          fact: "The Kaveri River is sometimes referred to as the 'Sarasvati of the South' due to its significance in Southern India."
        },
        {
          questionText: "Which Indian cave complex is known for its ancient rock-cut temples and sculptures dedicated to Hindu gods?",
          options: ["Ellora Caves", "Borra Caves", "Meghalaya Caves", "Badami Caves"],
          correctAnswer: 0,
          fact: "The Ellora Caves in Maharashtra are known for their rock-cut temples and sculptures dedicated to Hindu gods, Buddhists, and Jain deities."
        },
        {
          questionText: "Which of these texts focuses on the science of Ayurveda, specifically on surgical techniques?",
          options: ["Sushruta Samhita", "Charaka Samhita", "Brihat Samhita", "Vagbhata's Ashtanga Hridayam"],
          correctAnswer: 0,
          fact: "The 'Sushruta Samhita' is an ancient text that deals with surgical techniques and the practice of medicine in Ayurveda."
        }
      ]
    }
  ];
  


  async function insertQuizzes() {
    try {
      await Quiz.deleteMany({}); // Clear existing quizzes
      await Quiz.insertMany(data);
      console.log('Quizzes inserted successfully');
    } catch (err) {
      console.error('Error inserting quizzes:', err);
    } finally {
      mongoose.disconnect();
    }
  }
  
  insertQuizzes();
