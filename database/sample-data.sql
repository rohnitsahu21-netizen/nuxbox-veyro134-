-- NuxBox Sample Data
-- Optional: Run this to populate sample apps and data for testing

-- Sample Apps
INSERT INTO apps (name, description, category, version, file_name, file_size, icon_url, download_count, is_active)
VALUES
  ('VLC Media Player', 'Powerful and free media player for Linux. Play almost any video and audio files.', 'Multimedia', '3.0.20', 'vlc-3.0.20.zip', 5242880, 'https://via.placeholder.com/128/ff00aa/000000?text=VLC', 1543, true),
  ('GIMP', 'Free and open source image editor. Full featured raster graphics editor.', 'Graphics', '2.10.36', 'gimp-2.10.36.zip', 12582912, 'https://via.placeholder.com/128/00f0ff/000000?text=GIMP', 892, true),
  ('Blender', '3D modeling, animation, rendering and compositing software.', 'Graphics', '4.1.1', 'blender-4.1.1.zip', 314572800, 'https://via.placeholder.com/128/bf00ff/000000?text=BLENDER', 567, true),
  ('LibreOffice', 'Free office suite with writer, calc, impress and draw applications.', 'Office', '7.6.3', 'libreoffice-7.6.3.zip', 262144000, 'https://via.placeholder.com/128/00ff88/000000?text=LIBRE', 734, true),
  ('Audacity', 'Free, open source audio editor and recorder for multi-track editing.', 'Multimedia', '3.4.1', 'audacity-3.4.1.zip', 31457280, 'https://via.placeholder.com/128/ff00aa/000000?text=AUDIO', 456, true),
  ('VS Code', 'Lightweight but powerful source code editor for Linux.', 'Development', '1.92.0', 'vscode-1.92.0.zip', 125829120, 'https://via.placeholder.com/128/00f0ff/000000?text=CODE', 2134, true),
  ('Kdenlive', 'Open source video editor with multi-track editing capabilities.', 'Graphics', '23.12.3', 'kdenlive-23.12.3.zip', 157286400, 'https://via.placeholder.com/128/bf00ff/000000?text=VIDEO', 289, true),
  ('Thunderbird', 'Free email client and news reader for Linux systems.', 'Communication', '115.0', 'thunderbird-115.0.zip', 78643200, 'https://via.placeholder.com/128/00ff88/000000?text=MAIL', 612, true);
