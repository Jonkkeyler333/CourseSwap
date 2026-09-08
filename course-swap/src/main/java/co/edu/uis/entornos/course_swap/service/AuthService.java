package co.edu.uis.entornos.course_swap.service;

import co.edu.uis.entornos.course_swap.dto.AuthResponseDTO;
import co.edu.uis.entornos.course_swap.dto.EstudianteRegisterDTO;
import co.edu.uis.entornos.course_swap.dto.EstudianteResponseDTO;
import co.edu.uis.entornos.course_swap.dto.LoginRequestDTO;
import co.edu.uis.entornos.course_swap.model.Estudiante;
import co.edu.uis.entornos.course_swap.repository.EstudianteRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final EstudianteRepository estudianteRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(EstudianteRepository estudianteRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.estudianteRepository = estudianteRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public EstudianteResponseDTO registerUser(EstudianteRegisterDTO newEstudiante) {
        if (estudianteRepository.existsByEmail(newEstudiante.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado");
        }
        var estudiante = new Estudiante();
        estudiante.setEmail(newEstudiante.getEmail());
        estudiante.setPassword(passwordEncoder.encode(newEstudiante.getPassword()));
        estudiante.setNombre(newEstudiante.getNombre());
        estudiante.setApellido(newEstudiante.getApellido());
        estudiante.setCodigo(newEstudiante.getCodigo());
        estudianteRepository.save(estudiante);
        return EstudianteResponseDTO.builder()
                .id(estudiante.getId())
                .email(estudiante.getEmail())
                .nombre(estudiante.getNombre())
                .apellido(estudiante.getApellido())
                .codigo(estudiante.getCodigo())
                .build();
    }

    public AuthResponseDTO loginUser(LoginRequestDTO loginRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        var estudiante = estudianteRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Estudiante no encontrado"));
        UserDetails userDetails = new User(
                estudiante.getEmail(),
                estudiante.getPassword(),
                AuthorityUtils.NO_AUTHORITIES
        );
        String token = jwtService.generateToken(userDetails);
        return new AuthResponseDTO(token, estudiante.getEmail());

    }
}
