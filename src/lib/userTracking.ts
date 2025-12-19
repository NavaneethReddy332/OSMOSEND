import { supabase } from './supabase';

const USER_CODE_KEY = 'osmo_user_code';

export const generateUserCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const generateTransferCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const getUserCode = async (): Promise<string> => {
  let userCode = localStorage.getItem(USER_CODE_KEY);

  if (!userCode) {
    userCode = generateUserCode();

    const { error } = await supabase
      .from('users')
      .insert([{ user_code: userCode }]);

    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }

    localStorage.setItem(USER_CODE_KEY, userCode);
  } else {
    await supabase
      .from('users')
      .update({ last_active: new Date().toISOString() })
      .eq('user_code', userCode);
  }

  return userCode;
};

export const getUserId = async (userCode: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('user_code', userCode)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data?.id || null;
};
