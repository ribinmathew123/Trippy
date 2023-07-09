import bcrypt from 'bcrypt';

const hashPassword = async (password) => {
try {
const salt = await bcrypt.genSalt(12);
const hash = await bcrypt.hash(password, salt);
return hash;
} catch (error) {
throw error;
}
};

const comparePassword = async (password, hashed) => {
try {
const match = await bcrypt.compare(password, hashed);
return match;
} catch (error) {
throw error;
}
};

export { hashPassword, comparePassword };