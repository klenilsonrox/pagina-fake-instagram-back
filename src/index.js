import express from "express";
import cors from "cors";
import { connDB } from "./database/conndb.js";
import User from './models/User.js'; // Certifique-se de que o caminho está correto

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

connDB();

// Criar um novo usuário
app.post('/users', async (req, res) => {
    try {
        const { email, password } = req.body;
        const newUser = new User({ email, password });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Obter todos os usuários
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Atualizar um usuário
app.put('/users/:id', async (req, res) => {
    try {
        const { email, password } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { email, password }, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Deletar um usuário
app.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.status(204).send(); // 204 No Content
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
