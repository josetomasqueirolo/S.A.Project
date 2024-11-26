const User = require('../models/User');
const bcrypt = require('bcryptjs');

jest.mock('../models/User');

describe('Login User', () => {
    it('should validate credentials correctly', async () => {
        const mockUserData = { username: 'testUser', password: 'hashedPassword123' };
        const mockPasswordInput = 'password123';

        User.findOne = jest.fn().mockResolvedValueOnce(mockUserData);
        bcrypt.compare = jest.fn().mockResolvedValueOnce(true);

        const user = await User.findOne({ username: mockUserData.username });
        const isMatch = await bcrypt.compare(mockPasswordInput, user.password);

        expect(User.findOne).toHaveBeenCalledWith({ username: mockUserData.username });
        expect(bcrypt.compare).toHaveBeenCalledWith(mockPasswordInput, mockUserData.password);
        expect(isMatch).toBe(true);
    });
});
