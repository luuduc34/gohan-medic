// Importation de la fonction 'createClient' depuis le package 'supabase-js' pour interagir avec Supabase
import { createClient } from '@supabase/supabase-js'

// Création d'une instance du client Supabase avec l'URL du projet et la clé API
export const supabase = createClient('https://actveysuzoclardagmsk.supabase.co', // L'URL de votre instance Supabase 
 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdHZleXN1em9jbGFyZGFnbXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI0NzQxMzMsImV4cCI6MjA0ODA1MDEzM30.kVE5l_2jHFlGu_u1EzEPaa6VQP1LR3JC7wMpSayPIMs') // Clé API pour authentifier les requêtes