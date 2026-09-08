package co.edu.uis.entornos.course_swap.repository;

import co.edu.uis.entornos.course_swap.model.Estudiante;
import co.edu.uis.entornos.course_swap.repository.EstudianteRepository;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final EstudianteRepository estudianteRepository;

    public CustomUserDetailsService(EstudianteRepository estudianteRepository) {
        this.estudianteRepository = estudianteRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Estudiante estudiante = estudianteRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
        return new User(
                estudiante.getEmail(),
                estudiante.getPassword(),
                true, true, true, true,
                AuthorityUtils.NO_AUTHORITIES
        );
    }
}
