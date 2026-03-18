<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\UserModel;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\API\ResponseTrait;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthController extends BaseController
{
    private $key;
    use ResponseTrait;

    public function __construct()
    {
        $this->key = getenv('JWT_SECRET');
    }
    public function login()
    {
        helper('form');
        $rules = [
            'email'  => 'required|valid_email',
            'password' => 'required',
        ];
        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors());
        }
        $model = new UserModel;
        $user = $model->where('email', $this->request->getVar('email'))->first();
        // return $this->respond($user);
        if (!$user) {
            return $this->failUnauthorized('Invalid email or password');
        }
        if (!password_verify($this->request->getVar('password'), $user['password'])) {

            return $this->failUnauthorized('Invalid email or password');
        }

        $userId = $user['id'];

        $accessToken = $this->generateToken($userId, 300); // 5 mins
        $refreshToken = $this->generateToken($userId, 604800); // 7 days

        $tokenModel = new \App\Models\SessionModel();
        $tokenModel->insert([
            'user_id'       => $userId,
            'refresh_token' => $refreshToken,
            'expires_at'    => date(time() + 604800)
        ]);


        // Set Refresh Token in HttpOnly Cookie
        $this->response->setCookie([
            'name'     => 'refresh_token',
            'value'    => $refreshToken,
            'expire'   => 604800,
            'httponly' => true,
            'secure'   => false, // Set to false if using localhost without HTTPS
            'samesite' => 'lax',
            'path'     => 'api/auth/refresh', // Only sent to refresh endpoint
        ]);

        return $this->respond(['accessToken' => $accessToken]);
    }

    public function refresh()
    {
        $token = $this->request->getCookie('refresh_token');
        if (!$token) return $this->failUnauthorized('No refresh token');

        $tokenModel = new \App\Models\SessionModel();

        $storedToken = $tokenModel->where('refresh_token', $token)->first();
        if (!$storedToken) return $this->failUnauthorized('Token Revoked or Invalid');

        try {
            $decoded = JWT::decode($token, new Key($this->key, 'HS256'));
            $newAccessToken = $this->generateToken($decoded->sub, 900);
            return $this->respond(['accessToken' => $newAccessToken]);
        } catch (\Exception $e) {
            return $this->failUnauthorized('Invalid refresh token');
        }
    }

    private function generateToken($uid, $exp)
    {
        return JWT::encode(['sub' => $uid, 'iat' => time(), 'exp' => time() + $exp], $this->key, 'HS256');
    }
    public function logout()
    {
        $token = $this->request->getCookie('refresh_token');

        // 1. Hapus dari Database
        $tokenModel = new \App\Models\SessionModel();
        $tokenModel->where('refresh_token', $token)->delete();


        // 2. Hapus Cookie (set expire ke masa lalu)
        $this->response->setCookie([
            'name'   => 'refresh_token',
            'value'  => '',
            'expire' => -3600,
            'path'   => '/auth'
        ]);

        return $this->respond(['message' => 'Logged out successfully']);
    }

    public function me()
    {
        // Get the token from Authorization header
        $authHeader = $this->request->getServer('HTTP_AUTHORIZATION');
        if (!$authHeader) {
            return $this->failUnauthorized('Unauthorized');
        }

        $token = str_replace('Bearer ', '', $authHeader);

        try {
            // Decode token to get user ID
            $decoded = JWT::decode($token, new Key($this->key, 'HS256'));
            $userId = $decoded->sub;
        } catch (\Exception $e) {
            return $this->failUnauthorized('Invalid or expired token');
        }

        if (!$userId) {
            return $this->failUnauthorized('Unauthorized');
        }

        $userModel = new UserModel();
        $user = $userModel->find($userId);

        if (!$user) {
            return $this->failNotFound('User not found');
        }

        return $this->respond([
            'id'    => $user['id'],
            'name'  => $user['name'],
            'email' => $user['email'],
            'role'  => $user['role']
        ]);
    }
}
