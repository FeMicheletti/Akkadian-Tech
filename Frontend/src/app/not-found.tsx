'use client'

//* React
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

//* Redireciona qualquer rota não encontrada para a página principal
export default function NotFoundPage() {
	useEffect(() => { redirect('/login'); }, []);
	return null;
};