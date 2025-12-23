import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useServerStatus = (serverIP: string, discordServerId: string) => {
  const [serverStatus, setServerStatus] = useState('Checking...');
  const [discordMembers, setDiscordMembers] = useState('0');

  const fetchMinecraftStatus = useCallback(async (ip: string) => {
    if (!ip) return;
    try {
      const { data, error } = await supabase.functions.invoke('minecraft-status', {
        body: { serverIP: ip }
      });

      if (error) throw error;

      if (data.online) {
        setServerStatus(`In Game ${data.players.online} Online Players`);
      } else {
        setServerStatus('Server Offline');
      }
    } catch (error) {
      console.error('Error fetching Minecraft status:', error);
      setServerStatus('Status Unknown');
    }
  }, []);

  const fetchDiscordStats = useCallback(async (serverId: string) => {
    if (!serverId) return;
    try {
      const { data, error } = await supabase.functions.invoke('discord-stats', {
        body: { serverId }
      });

      if (error) throw error;
      setDiscordMembers(data.memberCount.toString());
    } catch (error) {
      console.error('Error fetching Discord stats:', error);
      setDiscordMembers('0');
    }
  }, []);

  useEffect(() => {
    if (serverIP) fetchMinecraftStatus(serverIP);
    if (discordServerId) fetchDiscordStats(discordServerId);

    const interval = setInterval(() => {
      if (serverIP) fetchMinecraftStatus(serverIP);
      if (discordServerId) fetchDiscordStats(discordServerId);
    }, 2000);

    return () => clearInterval(interval);
  }, [serverIP, discordServerId, fetchMinecraftStatus, fetchDiscordStats]);

  return { serverStatus, discordMembers };
};
