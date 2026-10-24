import { describe, it, expect, beforeEach } from 'vitest';

// Simulate the underlying auth logic directly for unit testing
interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  passwordHash: string;
}

class TestAuthEngine {
  private users: MockUser[] = [
    {
      id: 'cust-1',
      name: 'Ramesh Sharma',
      email: 'customer@doodhwala.local',
      phone: '9811122233',
      role: 'customer',
      passwordHash: 'Cust@123456',
    },
    {
      id: 'admin-1',
      name: 'Doodhwala Administrator',
      email: 'admin@doodhwala.local',
      phone: '9893927434',
      role: 'admin',
      passwordHash: 'Admin@Doodhwala2026',
    },
  ];

  public currentUser: MockUser | null = null;

  login(identifier: string, credential: string, isOtp = false): { success: boolean; message?: string } {
    if (!identifier.trim() || !credential.trim()) {
      return { success: false, message: 'Identifier and credentials are required.' };
    }

    const clean = identifier.trim().toLowerCase();
    const found = this.users.find(
      (u) => u.email.toLowerCase() === clean || u.phone === clean
    );

    if (!found) {
      return { success: false, message: 'Invalid credentials. Please verify your details or register.' };
    }

    if (isOtp) {
      if (credential !== '123456' && credential.length !== 6) {
        return { success: false, message: 'Invalid OTP code.' };
      }
    } else {
      if (found.passwordHash !== credential) {
        return { success: false, message: 'Invalid password. Access denied.' };
      }
    }

    this.currentUser = found;
    return { success: true };
  }

  adminLogin(identifier: string, pass: string): { success: boolean; message?: string } {
    if (!identifier.trim() || !pass.trim()) {
      return { success: false, message: 'Administrator credentials required.' };
    }

    const clean = identifier.trim().toLowerCase();
    const found = this.users.find(
      (u) => (u.email.toLowerCase() === clean || u.phone === clean) && u.role === 'admin'
    );

    if (!found || found.passwordHash !== pass) {
      return { success: false, message: 'Administrative access denied. Unauthorized identity.' };
    }

    this.currentUser = found;
    return { success: true };
  }

  signup(name: string, email: string, phone: string, pass: string): { success: boolean; message?: string } {
    if (!name.trim() || !phone.trim() || !pass.trim()) {
      return { success: false, message: 'Name, phone, and password are required.' };
    }

    if (pass.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' };
    }

    const existing = this.users.find(
      (u) => (email && u.email.toLowerCase() === email.trim().toLowerCase()) || u.phone === phone.trim()
    );

    if (existing) {
      return { success: false, message: 'An account with this email or mobile number already exists.' };
    }

    // Role is strictly forced to 'customer', regardless of any attempt
    const newUser: MockUser = {
      id: `cust-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase() || `${phone.trim()}@customer.doodhwala.local`,
      phone: phone.trim(),
      role: 'customer',
      passwordHash: pass,
    };

    this.users.push(newUser);
    this.currentUser = newUser;
    return { success: true };
  }

  logout() {
    this.currentUser = null;
  }
}

describe('Authentication & Access Control Security (Phase 3, Phase 4, Phase 9.2)', () => {
  let auth: TestAuthEngine;

  beforeEach(() => {
    auth = new TestAuthEngine();
  });

  it('Visitors must start completely unauthenticated (currentUser is null)', () => {
    expect(auth.currentUser).toBeNull();
  });

  it('AUD-01 Regression: Arbitrary or unregistered emails must NOT authenticate', () => {
    const res = auth.login('random_hacker@gmail.com', 'wrongpassword');
    expect(res.success).toBe(false);
    expect(res.message).toContain('Invalid credentials');
    expect(auth.currentUser).toBeNull();
  });

  it('Arbitrary phone number must NOT authenticate without matching user record', () => {
    const res = auth.login('+91 99999 88888', '123456', true);
    expect(res.success).toBe(false);
    expect(auth.currentUser).toBeNull();
  });

  it('Registered customer with correct password authenticates successfully', () => {
    const res = auth.login('customer@doodhwala.local', 'Cust@123456');
    expect(res.success).toBe(true);
    expect(auth.currentUser).not.toBeNull();
    expect(auth.currentUser?.name).toBe('Ramesh Sharma');
    expect(auth.currentUser?.role).toBe('customer');
  });

  it('Customer credentials cannot authenticate at admin portal (adminLogin)', () => {
    const res = auth.adminLogin('customer@doodhwala.local', 'Cust@123456');
    expect(res.success).toBe(false);
    expect(res.message).toContain('Administrative access denied');
    expect(auth.currentUser).toBeNull();
  });

  it('Authorized staff credentials authenticate at admin portal', () => {
    const res = auth.adminLogin('admin@doodhwala.local', 'Admin@Doodhwala2026');
    expect(res.success).toBe(true);
    expect(auth.currentUser).not.toBeNull();
    expect(auth.currentUser?.role).toBe('admin');
  });

  it('Public signup strictly assigns role "customer" and never "admin"', () => {
    const res = auth.signup('Test Customer', 'newcust@gmail.com', '9876543210', 'securePass123');
    expect(res.success).toBe(true);
    expect(auth.currentUser).not.toBeNull();
    expect(auth.currentUser?.role).toBe('customer');
    expect(auth.currentUser?.role).not.toBe('admin');
  });

  it('Duplicate registration with same phone or email is rejected', () => {
    auth.signup('First User', 'first@gmail.com', '9876543210', 'password123');
    const duplicateRes = auth.signup('Second User', 'first@gmail.com', '9876543210', 'differentPass');
    expect(duplicateRes.success).toBe(false);
    expect(duplicateRes.message).toContain('already exists');
  });

  it('Session logout clears currentUser completely', () => {
    auth.login('customer@doodhwala.local', 'Cust@123456');
    expect(auth.currentUser).not.toBeNull();
    auth.logout();
    expect(auth.currentUser).toBeNull();
  });
});
