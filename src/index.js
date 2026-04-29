const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// 中间件
app.use(cors());
app.use(express.json());

// 测试路由
app.get('/', (req, res) => {
  res.json({ message: '库存管理系统API运行中' });
});

// 用户注册
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, name } = req.body;
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: { username, password: hashedPassword, name }
    });
    res.json({ success: true, user: { id: user.id, username: user.username, name: user.name } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 用户登录
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ error: '用户不存在' });
    
    const valid = await bcrypt.compare(passw
